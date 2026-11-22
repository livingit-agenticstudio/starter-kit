# Runbook

Operator commands. Every section answers "how do I do X" with commands that can be pasted. When a command fails in a
known way, write the failure and the fix under it.

## Local dev

```sh
bun install
bun run setup   # .env from .env.example with a fresh secret, Postgres in Docker, migrations, seed
bun run dev     # http://localhost:5173
```

**`bun run setup` stops at `db:start`.** Docker is not running; start Docker Desktop (or the daemon) and run it again.

**Port 5432 is taken** (another Postgres on the machine). Set `DATABASE_PORT=5433` in `.env` and the same port in
`DATABASE_URL`, then `bun run db:start`.

**`/api/auth/...` answers 404.** better-auth answers only on the origin in `BETTER_AUTH_URL`. When `bun run dev` is on
another port than 5173, set `BETTER_AUTH_URL` in `.env` to that address and start it again.

## Database

```sh
bun run db:migrate     # apply drizzle/ to DATABASE_URL
bun run db:seed        # synthetic people and notes; safe to run again
bun run db:reset       # drop the local database and its volume, then start, migrate and seed it again
```

```sh
bun run db:generate    # a migration from src/lib/server/db/schema.ts; read the SQL before committing it
bun run auth:generate  # better-auth's tables after a plugin is added, into src/lib/server/db/auth-schema.ts
bun run db:studio      # Drizzle Studio on the local database
bun run db:stop        # stop Postgres; the data stays in its volume
```

## Verification

`bun run dev`, then open `/` and `/notes`: the notes from the seed are listed, a new one is shown first, and an empty
one is refused with a message. The session: `curl http://localhost:5173/api/auth/get-session` answers `null` when
nobody is signed in. The built app: `bun run build`, then `node build` with the variables of `.env` set (and
`ORIGIN` for the address it is reached at).

## Deploy

{{RUNBOOK_DEPLOY}}

### Rollback

{{RUNBOOK_ROLLBACK}}

## Rotate secrets

`BETTER_AUTH_SECRET` signs better-auth's cookies and tokens. Locally it lives in `.env`, written by `bun run setup`;
a new one (`openssl rand -base64 32`) signs everyone out. Where it lives once the app runs elsewhere is chosen with
the deploy. To roll it over without signing everyone out, better-auth reads `BETTER_AUTH_SECRETS` (plural); see its
`secrets` option.
