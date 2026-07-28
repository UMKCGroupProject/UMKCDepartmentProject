import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Whitelist of sortable fields. The value is an enum, never a column name, and
 * the mapping to a real column happens in ApplicationsService. Anything not in
 * this list is rejected by the ValidationPipe with a 400 before reaching the
 * database — which is what makes `?sortBy=gpa;DROP TABLE users--` a 400 rather
 * than the injection it was against the old string-interpolated queries.
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
