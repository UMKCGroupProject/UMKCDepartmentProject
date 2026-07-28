import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../users/student.entity';
import { User, UserRole } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './jwt.strategy';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.users.findOne({
      where: [{ email: dto.email }, { umkcId: dto.umkcId }],
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? 'This email is already registered'
          : 'This UMKC ID is already registered',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // One transaction for both inserts. The old client fired POST /register and
    // POST /register/student sequentially with no rollback, so a failure on the
    // second left an account with no student profile.
    const user = await this.dataSource.transaction(async (manager) => {
      const created = manager.create(User, {
        email: dto.email,
        umkcId: dto.umkcId,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        // Always a student. Never taken from the request body.
        role: UserRole.STUDENT,
      });
      const saved = await manager.save(created);

      await manager.save(
        manager.create(Student, {
          userId: saved.id,
          contactNo: dto.contactNo ?? null,
          certified: false,
        }),
      );

      return saved;
    });

    return new AuthResponseDto(this.signToken(user), user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // passwordHash is `select: false` on the entity, so ask for it explicitly.
    const user = await this.users.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        umkcId: true,
        email: true,
        passwordHash: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    // Same message and roughly the same work either way, so the response does
    // not reveal whether an email is registered.
    const hash = user?.passwordHash ?? '';
    const matches = hash ? await bcrypt.compare(dto.password, hash) : false;
    if (!user || !matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.users.update(user.id, { lastLoginAt: new Date() });

    return new AuthResponseDto(this.signToken(user), user);
  }

  private signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }
}
