import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../applications/application.entity';
import { Student } from './student.entity';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ name: 'umkc_id', type: 'char', length: 8, unique: true })
  umkcId!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  /**
   * The bcrypt hash of the user's password. Never the password itself.
   *
   * `select: false` means TypeORM leaves this column out of ordinary queries.
   * Code that genuinely needs it (only the login check) has to ask for it
   * explicitly, so it cannot be leaked into an API response by accident.
   */
  @Column({ name: 'password_hash', type: 'char', length: 60, select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt!: Date | null;

  @OneToOne(() => Student, (student) => student.user)
  student?: Student;

  @OneToMany(() => Application, (application) => application.user)
  applications?: Application[];
}
