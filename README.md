# GTA Portal

A web app where students apply for Graduate Teaching Assistant positions and
department admins review applicants course by course.

Originally a five-person undergraduate team project built in 2022, now being
modernized in the open — one phase per pull request. See
[Modernization status](#modernization-status) for where it currently stands.

## Modernization status

| Phase | Scope | Status |
| ----- | ----- | ------ |
| 0 | Repo cleanup & scaffolding | ✅ In this PR |
| 1 | Database redesign | ⬜ Not started |
| 2 | NestJS + TypeScript backend | ⬜ Not started |
| 3 | Vite migration | ⬜ Not started |
| 4 | Vue 3 Composition API frontend rewrite | ⬜ Not started |
| 5 | Docker & tests | ⬜ Not started |
| 6 | Tooling & CI | ⬜ Not started |
| 7 | Documentation | ⬜ Not started |

**Right now the app does not run.** The frontend is missing its `public/index.html`
entry point, and the Express API interpolates request input directly into SQL on
most routes. Both are fixed in later phases. Nothing here is deployed anywhere,
and the seed data is fictional.

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
api/         Express API — replaced by NestJS in Phase 2
gta-portal/  Vue 2-era vue-cli frontend — becomes web/ in Phase 3
```

## Local development

Current (pre-modernization) instructions, kept until the phases that replace them:

```bash
cd gta-portal
npm install
npm run serve    # see the note above — this does not currently mount
```

## License

MIT — added in Phase 7.
