import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

/** Student-only profile fields, keyed one-to-one on users.id. */
@Entity('students')
export class Student {
  @PrimaryColumn({ name: 'user_id', type: 'int', unsigned: true })
  userId!: number;

  @Column({ name: 'contact_no', type: 'varchar', length: 20, nullable: true })
  contactNo!: string | null;

  @Column({ type: 'boolean', default: false })
  certified!: boolean;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
