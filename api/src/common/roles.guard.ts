import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user.entity';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { ROLES_KEY } from './roles.decorator';

/**
 * Runs after JwtAuthGuard, so `request.user` is already populated. Privilege
 * is decided here on the server; the old app decided it in the browser from
 * the length of the submitted ID string.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();

    if (!request.user || !required.includes(request.user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
