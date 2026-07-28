import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/jwt.strategy';

/**
 * Injects the signed-in user into a handler argument:
 *
 *   create(@CurrentUser() user: AuthenticatedUser) { ... }
 *
 * The value comes from the verified JWT via JwtStrategy.validate(). Handlers
 * use this rather than reading a user id out of the request body, which a
 * client could set to anyone's id.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);
