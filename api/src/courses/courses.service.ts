import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courses: Repository<Course>,
  ) {}

  findAll(): Promise<Course[]> {
    return this.courses.find({ order: { courseNo: 'ASC', section: 'ASC' } });
  }
}
