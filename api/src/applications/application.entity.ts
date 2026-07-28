import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

export enum CurrentLevel {
  FRESHMAN = 'freshman',
  SOPHOMORE = 'sophomore',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  GRADUATE = 'graduate',
}

export enum Position {
  GRADER = 'grader',
  LAB_INSTRUCTOR = 'lab instructor',
  BOTH = 'both',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
@Unique('uq_applications_user_course', ['userId', 'courseId'])
@Index('idx_applications_course_gpa', ['courseId', 'gpa'])
export class Application {
  @ApiProperty()
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ApiProperty()
  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId!: number;

  @ApiProperty()
  @Column({ name: 'course_id', type: 'int', unsigned: true })
  courseId!: number;

  /**
   * MySQL returns DECIMAL as a string to preserve precision; the transformer
   * hands the rest of the app a number so `gpa.toFixed()` and JSON output
   * behave.
   */
  @ApiProperty({ example: 3.75 })
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | null): number | null =>
        value === null ? null : Number(value),
    },
  })
  gpa!: number;

  @ApiProperty({ example: 120 })
  @Column({ name: 'hrs_completed', type: 'smallint', unsigned: true })
  hrsCompleted!: number;

  @ApiProperty({ enum: CurrentLevel })
  @Column({ name: 'curr_level', type: 'enum', enum: CurrentLevel })
  currLevel!: CurrentLevel;

  @ApiProperty({ example: 'Spring 2026' })
  @Column({ name: 'grad_semester', type: 'varchar', length: 15 })
  gradSemester!: string;

  @ApiProperty({ example: "Associate's" })
  @Column({ type: 'varchar', length: 30 })
  degree!: string;

  @ApiProperty({ example: 'Computer Science' })
  @Column({ name: 'curr_major', type: 'varchar', length: 50 })
  currMajor!: string;

  @ApiProperty({ enum: Position })
  @Column({ type: 'enum', enum: Position })
  position!: Position;

  /** Collected by the old application form, then silently dropped on submit. */
  @ApiProperty({ example: 'Fall 2024', nullable: true })
  @Column({
    name: 'certification_term',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  certificationTerm!: string | null;

  /** Also collected and dropped by the old form. */
  @ApiProperty()
  @Column({ name: 'prev_degree', type: 'boolean', default: false })
  prevDegree!: boolean;

  @ApiProperty({ enum: ApplicationStatus })
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @ApiProperty()
  @CreateDateColumn({ name: 'applied_at' })
  appliedAt!: Date;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course?: Course;
}
