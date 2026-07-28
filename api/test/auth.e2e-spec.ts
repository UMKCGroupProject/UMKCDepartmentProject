import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, uniqueUmkcId } from './setup-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const server = () => app.getHttpServer() as Parameters<typeof request>[0];

  function newUser(overrides: Record<string, unknown> = {}) {
    const id = uniqueUmkcId();
    return {
      email: `user-${id}@example.edu`,
      umkcId: id,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      ...overrides,
    };
  }

  it('registers a new student and returns a token', async () => {
    const res = await request(server())
      .post('/auth/register')
      .send(newUser())
      .expect(201);

    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.user.role).toBe('student');
  });

  it('rejects a duplicate email with 409', async () => {
    const user = newUser();
    await request(server()).post('/auth/register').send(user).expect(201);

    await request(server())
      .post('/auth/register')
      .send({ ...user, umkcId: uniqueUmkcId() })
      .expect(409);
  });

  it('rejects a weak password with 400', async () => {
    const res = await request(server())
      .post('/auth/register')
      .send(newUser({ password: 'short' }))
      .expect(400);

    expect(res.body.message).toContain(
      'Password must be at least 8 characters',
    );
  });

  it('rejects a umkcId that is not 8 digits with 400', async () => {
    await request(server())
      .post('/auth/register')
      .send(newUser({ umkcId: '123' }))
      .expect(400);
  });

  // The headline regression: the old API took isAdmin straight from the body.
  it('ignores a role supplied in the registration body', async () => {
    const res = await request(server())
      .post('/auth/register')
      .send(newUser({ role: 'admin', isAdmin: 1 }))
      .expect(201);

    expect(res.body.user.role).toBe('student');
  });

  it('logs in and returns a token', async () => {
    const user = newUser();
    await request(server()).post('/auth/register').send(user).expect(201);

    const res = await request(server())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.user.email).toBe(user.email);
  });

  // The old login route did SELECT * and returned result[0] verbatim.
  it('never includes the password hash in a response body', async () => {
    const user = newUser();
    const registered = await request(server())
      .post('/auth/register')
      .send(user)
      .expect(201);

    const loggedIn = await request(server())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    for (const body of [registered.body, loggedIn.body]) {
      const serialized = JSON.stringify(body);
      expect(serialized).not.toContain('passwordHash');
      expect(serialized).not.toContain('password_hash');
      expect(serialized).not.toMatch(/\$2[aby]\$/); // no bcrypt hash anywhere
    }
  });

  it('gives the same error for an unknown email and a wrong password', async () => {
    const user = newUser();
    await request(server()).post('/auth/register').send(user).expect(201);

    const wrongPassword = await request(server())
      .post('/auth/login')
      .send({ email: user.email, password: 'WrongPassword1!' })
      .expect(401);

    const unknownEmail = await request(server())
      .post('/auth/login')
      .send({ email: 'nobody-here@example.edu', password: 'Password123!' })
      .expect(401);

    expect(wrongPassword.body.message).toBe('Invalid credentials');
    expect(unknownEmail.body.message).toBe('Invalid credentials');
  });

  it('rejects /auth/me without a token', async () => {
    await request(server()).get('/auth/me').expect(401);
  });
});
