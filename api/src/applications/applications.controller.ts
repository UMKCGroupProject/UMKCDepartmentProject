import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { UserRole } from '../users/user.entity';
import { Application } from './application.entity';
import {
  ApplicationsService,
  PaginatedApplications,
} from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an application for a course' })
  @ApiResponse({ status: 201, type: Application })
  @ApiResponse({ status: 409, description: 'Already applied to this course' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applications.create(user.id, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: "The signed-in user's own applications" })
  findMine(@CurrentUser() user: AuthenticatedUser): Promise<Application[]> {
    return this.applications.findMine(user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'List and sort all applications (admin only)',
    description:
      '`sortBy` is an enum mapped to a column in code, never interpolated into SQL.',
  })
  @ApiResponse({ status: 403, description: 'Not an admin' })
  findAll(
    @Query() query: QueryApplicationsDto,
  ): Promise<PaginatedApplications> {
    return this.applications.findAll(query);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Accept or reject an application (admin only)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ): Promise<Application> {
    return this.applications.updateStatus(id, dto.status);
  }
}
