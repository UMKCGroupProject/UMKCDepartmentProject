import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, uniqueUmkcId } from './setup-app';

describe('Applications (e2e)', () => {
  let app: INestApplication;
  let studentToken: string;
  let adminToken: string;

  const server = () => app.getHttpServer() as Parameters<typeof request>[0];

  beforeAll(async () => {
    app = await createTestApp();

    const id = uniqueUmkcId();
    const student = await request(server())
      .post('/auth/register')
      .send({
        email: `applicant-${id}@example.edu`,
        umkcId: id,
        password: 'Password123!',
        firstName: 'App',
        lastName: 'Licant',
      })
      .expect(201);
    studentToken = student.body.accessToken;

    // Seeded admin from db/02-seed.sql.
    const admin = await request(server())
      .post('/auth/login')
      .send({ email: 'admin@example.edu', password: 'Password123!' })
      .expect(200);
    adminToken = admin.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  const validApplication = {
    courseId: 5,
    gpa: 3.5,
    hrsCompleted: 100,
    currLevel: 'junior',
    gradSemester: 'Fall 2027',
    degree: 'None',
    currMajor: 'Computer Science',
    position: 'grader',
  };

  it('rejects an unauthenticated request with 401', async () => {
    await request(server()).get('/applications').expect(401);
    await request(server()).get('/applications/mine').expect(401);
    await request(server()).post('/applications').send(validApplication).expect(401);
  });

  it('rejects a student hitting the admin list with 403', async () => {
    const res = await request(server())
      .get('/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);

    expect(res.body.message).toBe('Insufficient permissions');
  });

  it('lets an admin list applications', async () => {
    const res = await request(server())
      .get('/applications')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('accepts every whitelisted sort field', async () => {
    for (const sortBy of [
      'gpa',
      'hrsCompleted',
      'lastName',
      'firstName',
      'appliedAt',
    ]) {
      await request(server())
        .get('/applications')
        .query({ sortBy, order: 'ASC' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    }
  });

  it('actually sorts by GPA descending', async () => {
    const res = await request(server())
      .get('/applications')
      .query({ sortBy: 'gpa', order: 'DESC', limit: 100 })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const gpas = res.body.data.map((a: { gpa: number }) => Number(a.gpa));
    expect(gpas).toEqual([...gpas].sort((a, b) => b - a));
  });

  // Explicit regression for the original injection class: the old routes
  // interpolated req.query straight into the SQL string.
  it('rejects a SQL injection attempt in sortBy with 400', async () => {
    const res = await request(server())
      .get('/applications')
      .query({ courseId: 1, sortBy: 'gpa; DROP TABLE users--' })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    expect(String(res.body.message)).toContain('sortBy must be one of');

    // And the table is still there.
    await request(server())
      .post('/auth/login')
      .send({ email: 'admin@example.edu', password: 'Password123!' })
      .expect(200);
  });

  it('rejects an out-of-range GPA with 400', async () => {
    const res = await request(server())
      .post('/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ ...validApplication, gpa: 5.5 })
      .expect(400);

    expect(res.body.message).toContain('GPA must be between 0 and 4.0');
  });

  it('rejects non-numeric hours with 400', async () => {
    await request(server())
      .post('/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ ...validApplication, hrsCompleted: 'lots' })
      .expect(400);
  });

  it('creates an application from the JWT, ignoring userId and status in the body', async () => {
    const res = await request(server())
      .post('/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        ...validApplication,
        certificationTerm: 'Fall 2025',
        prevDegree: true,
        userId: 1, // the seeded admin
        status: 'accepted',
      })
      .expect(201);

    expect(res.body.userId).not.toBe(1);
    expect(res.body.status).toBe('pending');
    // Both were collected by the old form and then dropped from the payload.
    expect(res.body.certificationTerm).toBe('Fall 2025');
    expect(res.body.prevDegree).toBe(true);
  });

  it('rejects a second application to the same course with 409', async () => {
    await request(server())
      .post('/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(validApplication)
      .expect(409);
  });

  it('returns only the caller’s own applications from /mine', async () => {
    const res = await request(server())
      .get('/applications/mine')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].courseId).toBe(validApplication.courseId);
  });

  it('lets an admin change a status but not a student', async () => {
    const list = await request(server())
      .get('/applications')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const id = list.body.data[0].id;

    await request(server())
      .patch(`/applications/${id}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'accepted' })
      .expect(403);

    const res = await request(server())
      .patch(`/applications/${id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'accepted' })
      .expect(200);

    expect(res.body.status).toBe('accepted');
  });

  it('rejects an unknown status value with 400', async () => {
    await request(server())
      .patch('/applications/1/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' })
      .expect(400);
  });
});
