import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ApiProperty({ example: 'CS101' })
  @Column({ name: 'course_no', type: 'varchar', length: 10 })
  courseNo!: string;

  @ApiProperty({ example: 'Problem Solving and Programming I' })
  @Column({ name: 'course_name', type: 'varchar', length: 120 })
  courseName!: string;

  @ApiProperty({ example: '0001-LEC' })
  @Column({ type: 'varchar', length: 30 })
  section!: string;

  @ApiProperty({ example: 'MoWeFr' })
  @Column({ type: 'varchar', length: 20 })
  days!: string;

  @ApiProperty({ example: '1:00PM - 1:50PM' })
  @Column({ type: 'varchar', length: 20 })
  times!: string;

  @ApiProperty({ example: 'In-Person' })
  @Column({ type: 'varchar', length: 25 })
  modality!: string;

  @ApiProperty({ example: 'Fairview Hall-Rm 102', nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  room!: string | null;

  @ApiProperty({ example: 'Dr. Marion Hale' })
  @Column({ type: 'varchar', length: 80 })
  instructor!: string;
}
