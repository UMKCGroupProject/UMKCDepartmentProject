import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * The fields a client is allowed to sort by.
 *
 * These are API-level names, not database column names — the translation to a
 * real column happens in ApplicationsService. Because this is an enum, the
 * ValidationPipe rejects anything else with a 400 before the request reaches
 * the service, so no caller-supplied text can ever reach an ORDER BY clause.
 */
export enum ApplicationSortBy {
  GPA = 'gpa',
  HRS_COMPLETED = 'hrsCompleted',
  LAST_NAME = 'lastName',
  FIRST_NAME = 'firstName',
  APPLIED_AT = 'appliedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryApplicationsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  courseId?: number;

  @ApiPropertyOptional({ enum: ApplicationSortBy, default: ApplicationSortBy.GPA })
  @IsOptional()
  @IsEnum(ApplicationSortBy, {
    message: `sortBy must be one of: ${Object.values(ApplicationSortBy).join(', ')}`,
  })
  sortBy: ApplicationSortBy = ApplicationSortBy.GPA;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 25, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;
}
