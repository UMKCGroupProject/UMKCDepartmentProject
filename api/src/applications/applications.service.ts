import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/course.entity';
import { Application, ApplicationStatus } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
  ApplicationSortBy,
  QueryApplicationsDto,
} from './dto/query-applications.dto';

export interface PaginatedApplications {
  data: Application[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Translates the public sort names into real, fully-qualified column names.
 *
 * This lookup table is the only bridge between a client-supplied value and an
 * ORDER BY clause. Because the result can only ever be one of these five
 * hardcoded strings, a caller cannot inject SQL through the sort parameter.
 */
const SORT_COLUMNS: Record<ApplicationSortBy, string> = {
  [ApplicationSortBy.GPA]: 'application.gpa',
  [ApplicationSortBy.HRS_COMPLETED]: 'application.hrsCompleted',
  [ApplicationSortBy.LAST_NAME]: 'user.lastName',
  [ApplicationSortBy.FIRST_NAME]: 'user.firstName',
  [ApplicationSortBy.APPLIED_AT]: 'application.appliedAt',
};

export function resolveSortColumn(sortBy: ApplicationSortBy): string {
  const column = SORT_COLUMNS[sortBy];
  if (!column) {
    // Not reachable through the API, since the ValidationPipe rejects unknown
    // values first. Kept so the safety guarantee holds even if this function is
    // called from somewhere else later.
    throw new Error(`Unsupported sort field: ${String(sortBy)}`);
  }
  return column;
}

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
    @InjectRepository(Course)
    private readonly courses: Repository<Course>,
  ) {}

  async create(
    userId: number,
    dto: CreateApplicationDto,
  ): Promise<Application> {
    const course = await this.courses.findOne({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException(`Course ${dto.courseId} does not exist`);
    }

    const existing = await this.applications.findOne({
      where: { userId, courseId: dto.courseId },
    });
    if (existing) {
      throw new ConflictException(
        'You have already applied to this course',
      );
    }

    const application = this.applications.create({
      ...dto,
      userId, // from the verified token, never from the request body
      certificationTerm: dto.certificationTerm ?? null,
      prevDegree: dto.prevDegree ?? false,
      status: ApplicationStatus.PENDING,
    });

    return this.applications.save(application);
  }

  /**
   * The signed-in student's own applications, newest first. Scoped by userId,
   * so this endpoint can never return someone else's data.
   */
  findMine(userId: number): Promise<Application[]> {
    return this.applications.find({
      where: { userId },
      relations: { course: true },
      order: { appliedAt: 'DESC' },
    });
  }

  /**
   * Admin listing: every application, optionally filtered to one course, sorted
   * by any whitelisted field, and paginated.
   */
  async findAll(query: QueryApplicationsDto): Promise<PaginatedApplications> {
    const qb = this.applications
      .createQueryBuilder('application')
      .innerJoinAndSelect('application.user', 'user')
      .innerJoinAndSelect('application.course', 'course');

    if (query.courseId !== undefined) {
      // `:courseId` is a bound parameter — the driver sends the value
      // separately from the SQL text, so it can never be read as SQL.
      qb.andWhere('application.courseId = :courseId', {
        courseId: query.courseId,
      });
    }

    qb.orderBy(resolveSortColumn(query.sortBy), query.order)
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async updateStatus(
    id: number,
    status: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.applications.findOne({
      where: { id },
      relations: { user: true, course: true },
    });
    if (!application) {
      throw new NotFoundException(`Application ${id} not found`);
    }

    application.status = status;
    return this.applications.save(application);
  }
}
