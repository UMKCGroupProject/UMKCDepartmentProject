import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CurrentLevel, Position } from '../application.entity';

export class CreateApplicationDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  courseId!: number;

  @ApiProperty({ example: 3.75, minimum: 0, maximum: 4 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'GPA must be a number' })
  @Min(0, { message: 'GPA must be between 0 and 4.0' })
  @Max(4, { message: 'GPA must be between 0 and 4.0' })
  gpa!: number;

  @ApiProperty({ example: 120, minimum: 0, maximum: 400 })
  @Type(() => Number)
  @IsInt({ message: 'Hours completed must be a whole number' })
  @Min(0)
  @Max(400)
  hrsCompleted!: number;

  @ApiProperty({ enum: CurrentLevel })
  @IsEnum(CurrentLevel)
  currLevel!: CurrentLevel;

  @ApiProperty({ example: 'Spring 2026' })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  gradSemester!: string;

  @ApiProperty({ example: "Associate's" })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  degree!: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  currMajor!: string;

  @ApiProperty({ enum: Position })
  @IsEnum(Position)
  position!: Position;

  /** Collected by the old form and then dropped from the request payload. */
  @ApiProperty({ example: 'Fall 2024', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  certificationTerm?: string;

  /** Also collected and dropped by the old form. */
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  prevDegree?: boolean;

  // No `userId`: it comes from the JWT. No `status`: applications always start
  // as 'pending' and only an admin can change that.
}
