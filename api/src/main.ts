import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());

  // Only the configured frontend origin may call this API from a browser.
  app.enableCors({
    origin: config.getOrThrow<string>('CORS_ORIGIN'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // Drops any request property the DTO does not declare. This is what stops
      // a client from smuggling extra fields such as `role` or `userId` into a
      // handler — see the note at the bottom of RegisterDto.
      whitelist: true,
      // Turns the plain JSON body into an instance of the DTO class, so the
      // @Type(() => Number) conversions in the DTOs actually run.
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GTA Portal API')
    .setDescription(
      'Graduate Teaching Assistant application portal. Log in via /auth/login, then Authorize with the returned token.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  new Logger('Bootstrap').log(
    `API listening on http://localhost:${port} — docs at /api/docs`,
  );
}

void bootstrap();
