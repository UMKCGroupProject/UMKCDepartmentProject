import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../users/user.entity';

/**
 * The only user shape that ever leaves the API. Built by an explicit
 * constructor rather than by spreading the entity, so a column added later
 * cannot accidentally become public.
 */
export class UserResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() umkcId: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;

  constructor(user: User) {
    this.id = user.id;
    this.umkcId = user.umkcId;
    this.email = user.email;
    this.role = user.role;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;

  constructor(accessToken: string, user: User) {
    this.accessToken = accessToken;
    this.user = new UserResponseDto(user);
  }
}
