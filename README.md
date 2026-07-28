# GTA Portal

A web app where students apply for Graduate Teaching Assistant positions and
department admins review applicants course by course.

Originally a five-person undergraduate team project built in 2022, now being
modernized in the open — one phase per pull request. See
[Modernization status](#modernization-status) for where it currently stands.

## Modernization status

| Phase | Scope | Status |
| ----- | ----- | ------ |
| 0 | Repo cleanup & scaffolding | ✅ Done |
| 1 | Database redesign | ✅ Done |
| 2 | NestJS + TypeScript backend | ✅ In this PR |
| 3 | Vite migration | ⬜ Not started |
| 4 | Vue 3 Composition API frontend rewrite | ⬜ Not started |
| 5 | Docker & tests | ⬜ Not started |
| 6 | Tooling & CI | ⬜ Not started |
| 7 | Documentation | ⬜ Not started |

**The API runs; the frontend does not yet.** The Vue app is still missing its
`index.html` entry point, fixed in Phase 3. Nothing here is deployed anywhere,
and all seed data is fictional.

### What Phase 2 did

Replaced the Express API with NestJS + TypeScript in `api/`, and closed the
security holes that made the original interesting to come back to.

**The seven SQL injection points are gone.** Every query now goes through a
TypeORM repository with bound parameters. The original built SQL by string
interpolation, including the login route:

```js
// before — auth-bypassable
`SELECT * FROM Accounts WHERE email = '${req.body.email}'`
```

Other fixes worth calling out:

| Then | Now |
| ---- | --- |
| The student ID *was* the password (bcrypt'd into the `umkcID` column) | Real `password_hash`, `MinLength(8)` enforced |
| `isAdmin` read from the request body; the browser set it via `if (umkcID.length === 9)` | Role is always `student` server-side; a `role` field in the body is stripped by `whitelist: true` |
| JWTs signed with the literal string `'TOKEN'` | `JWT_SECRET` from env, Joi-validated at boot to be ≥32 chars |
| Login returned `SELECT *`, leaking the hash | `UserResponseDto` built field by field |
| Register fired two sequential inserts, no rollback | One transaction |
| Wide-open `cors()`, no security headers | CORS scoped to `CORS_ORIGIN`, plus `helmet` |
| Five byte-identical sort routes (one of which sorted by the wrong column) | One `GET /applications?courseId=&sortBy=&order=`, `sortBy` an enum mapped to a column in code |
| GPA and hours were unvalidated free text | `class-validator`: GPA 0–4.0, hours an integer |
| `certificationTerm` / `prevDegree` collected then dropped | Persisted |
| No way to accept or reject | `PATCH /applications/:id/status`, admin only |

Live API docs are served at **`/api/docs`** (Swagger).

Verified against a `mysql:8` container seeded from `db/`:

```
registering with "role":"admin"   -> account created as student  ✅
login response contains a hash    -> no                          ✅
student GET /applications         -> 403                         ✅
?sortBy=gpa; DROP TABLE users--   -> 400, users table intact      ✅
GPA 5.5                           -> 400                         ✅
```

### What Phase 1 did

Rewrote the database as `db/01-schema.sql` + `db/02-seed.sql`.

The old dump had no foreign keys, no indexes beyond primary keys, and a join
that could never succeed: `Accounts.umkcID` was a `VARCHAR(65)` holding a bcrypt
hash while `Students.umkcID` was an `INT`. It also shipped real-looking
university emails, student IDs, GPAs and instructor names in a public repo.

- Split login identity (`users`) from student profile (`students`) on a real
  surrogate key, with foreign keys and `ON DELETE CASCADE` throughout.
- `password_hash` is its own column. `role` is an `ENUM` defaulting to
  `'student'`, so privilege can only ever be granted server-side.
- `applications` gained `UNIQUE(user_id, course_id)`, `INDEX(course_id, gpa)`
  for the admin dashboard's main query, and a `status` enum for review.
- Applicant name and email are no longer duplicated onto every application.
- **All real data replaced** with invented people and courses on the reserved
  `example.edu` domain: 1 admin, 8 students, 6 courses, 12 applications.
- Dropped the debug `SELECT *` after every `CREATE` and the two hardcoded
  course-`12719` analytics queries.

Verified by mounting `db/` into a `mysql:8` container — both scripts run clean
and every foreign key resolves. Demo accounts (password `Password123!` for all):

| Role | Email |
| ---- | ----- |
| Admin | `admin@example.edu` |
| Student | `avery@example.edu` |

Nothing reads this schema yet; the NestJS API in Phase 2 is the first consumer.

### What Phase 0 did

Housekeeping only — no behavior changed.

- Deleted committed scratch files (`test.txt`, `newbranchgio.txt`) and local
  Visual Studio state (`api/.vs/`, including a binary `slnx.sqlite`).
- Deleted unreferenced components (`Home/Show.vue`, `Admin/Table.vue`) and images.
- Deleted `src/assets/style.css` — a 922-line vendored copy of Bootstrap 4 that
  was loaded *after* Bootstrap 5 from `node_modules`, so the two frameworks were
  overriding each other.
- Added `.nvmrc` (Node 20) and `.editorconfig`.
- Rewrote `.gitignore`, which previously only ignored `.env.local` and so would
  have happily committed a real `.env`.

## Target stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Vue 3, Vite, Composition API, Pinia |
| Backend  | NestJS, TypeScript, TypeORM |
| Database | MySQL 8 |
| Infra    | Docker Compose, GitHub Actions |

## Repository layout

```
db/          MySQL schema and demo seed data
api/         NestJS + TypeScript API
gta-portal/  Vue 2-era vue-cli frontend — becomes web/ in Phase 3
```

## Local development

### API

Needs a MySQL 8 instance seeded from `db/`. Docker Compose arrives in Phase 5;
until then:

```bash
docker run -d --name gta-db -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=gta_portal \
  -e MYSQL_USER=gta -e MYSQL_PASSWORD=gtapw \
  -v "$PWD/db:/docker-entrypoint-initdb.d:ro" mysql:8

cd api
cp .env.example .env      # then set JWT_SECRET to 32+ characters
npm install
npm run start:dev
```

Then open <http://localhost:3000/api/docs>, log in via `POST /auth/login` with a
demo account below, and paste the returned token into **Authorize**.

### Frontend

Still the original vue-cli app, and still does not mount — Phase 3 fixes it.

```bash
cd gta-portal && npm install && npm run serve
```

## License

MIT — added in Phase 7.
