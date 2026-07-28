import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/http-exception.filter';

/**
 * Boots the real application against the test database, with the same global
 * pipe and filter main.ts installs — otherwise the specs would be testing a
 * different app than the one that ships.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();
  return app;
}

/** A unique 8-digit id per registration, so specs don't collide. */
let counter = 0;
export function uniqueUmkcId(): string {
  counter += 1;
  return String(90000000 + (Date.now() % 1000) * 10 + counter).slice(0, 8);
}
