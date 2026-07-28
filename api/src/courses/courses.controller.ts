import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  // The old `/courseNum` route is gone: it read `req.body` on a GET, so its
  // WHERE clause was always `courseNo = 'undefined'`.
  @Get()
  @ApiOperation({ summary: 'List all courses' })
  findAll(): Promise<Course[]> {
    return this.courses.findAll();
  }
}
