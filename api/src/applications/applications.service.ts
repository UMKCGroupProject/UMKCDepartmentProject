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
 * Maps the public sort enum to a qualified column. Kept as a plain object so
 * it can be unit tested without a database, and so no caller can ever reach
 * the ORDER BY clause with a string of its own.
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
    // Unreachable through the API — the ValidationPipe rejects unknown values
    // first — but this keeps the guarantee local to the function.
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
      userId, // from the JWT, never from the request body
      certificationTerm: dto.certificationTerm ?? null,
      prevDegree: dto.prevDegree ?? false,
      status: ApplicationStatus.PENDING,
    });

    return this.applications.save(application);
  }

  /** The signed-in student's own applications. */
  findMine(userId: number): Promise<Application[]> {
    return this.applications.find({
      where: { userId },
      relations: { course: true },
      order: { appliedAt: 'DESC' },
    });
  }

  /**
   * Admin listing. Replaces five byte-identical routes that differed only in
   * their ORDER BY — one of which (`/applicationsGPA`) actually sorted by
   * `currMajor DESC`.
   */
  async findAll(query: QueryApplicationsDto): Promise<PaginatedApplications> {
    const qb = this.applications
      .createQueryBuilder('application')
      .innerJoinAndSelect('application.user', 'user')
      .innerJoinAndSelect('application.course', 'course');

    if (query.courseId !== undefined) {
      // Parameterized, not interpolated.
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
