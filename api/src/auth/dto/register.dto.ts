import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'avery@example.edu' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: '20000009', description: 'Exactly 8 digits' })
  @Matches(/^\d{8}$/, { message: 'umkcId must be exactly 8 digits' })
  umkcId!: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72, { message: 'Password must be at most 72 characters' })
  password!: string;

  @ApiProperty({ example: 'Avery' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ example: 'Nakamura' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName!: string;

  @ApiProperty({ example: '555-0109', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNo?: string;

  // There is deliberately no `role` field here.
  //
  // The global ValidationPipe runs with `whitelist: true`, which strips any
  // property the DTO does not declare. So a client that POSTs
  // { ..., "role": "admin" } has that key removed before AuthService ever
  // sees it. Leaving `role` out of this class is what makes that safe.
}
