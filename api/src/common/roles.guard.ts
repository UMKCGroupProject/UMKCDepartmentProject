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
 * Enforces `@Roles(...)` on a controller or handler.
 *
 * Runs after JwtAuthGuard, so `request.user` is already filled in from the
 * verified token. A route with no @Roles decorator is left alone — this guard
 * only restricts what has explicitly been marked as restricted.
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
