# Contributing

## Getting set up

You need Node 20 (see `.nvmrc`) and Docker.

```bash
docker compose up          # everything, at http://localhost:8080
```

For day-to-day work, run the database in Docker and the two apps on the host so
you get hot reload — see **Local development** in the [README](README.md).

## Before opening a pull request

Run the same checks CI does:

```bash
cd api && npm run lint && npm run typecheck && npm test
cd web && npm run lint && npm run typecheck && npm test
```

The API end-to-end suite needs a database running:

```bash
cd api && npm run test:e2e
```

`npm run lint:fix` and `npm run format` will fix most style complaints
automatically.

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org):
  `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`. Explain *why* in the
  body, not just what.
- **Database columns** are `snake_case`; TypeORM entities map them to
  `camelCase` properties.
- **Validation belongs on the server.** Client-side checks are a convenience and
  should mirror the DTO, never replace it.
- **Never trust the request body for identity or privilege.** The user comes
  from the JWT via `@CurrentUser()`, and roles are enforced with `@Roles()`.
- **Every form control needs a label.** Use `FormField`, which wires the `id`,
  the error and `aria-describedby` for you.

## Changing the database

`db/01-schema.sql` and `db/02-seed.sql` run once, when MySQL initialises an
empty data volume. After editing either, recreate the volume:

```bash
docker compose down -v && docker compose up
```

Seed data must stay obviously fictional — invented names and `@example.edu`
addresses. This repository is public.
