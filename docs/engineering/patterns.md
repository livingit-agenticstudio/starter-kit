# Engineering Patterns

How code in this repo is shaped. Agents read this before a nontrivial change so that new code looks like the old code.
Each section is a rule, a short reason, and a pointer to a file that does it well.

Add a section the second time you explain the same thing in a review. Remove one when nothing follows it anymore.

## Where things live

```
src/
  app.css                 the theme as CSS variables, mapped to shadcn-svelte's
  app.d.ts                what `locals` holds: the session and each route's collaborators
  hooks.server.ts         Paraglide, then the request's collaborators, then better-auth and the session
  routes/                 pages: a +page.server.ts reads and writes, a +page.svelte renders
  lib/
    components/ui/        shadcn-svelte's components, added with `bunx shadcn-svelte@latest add <name>`
    auth-client.ts        better-auth in the browser
    server/               everything with a rule or an outside service; server-only by SvelteKit's rule
      auth/               the better-auth instance (index.ts) and its options apart from SvelteKit (options.ts)
      db/                 the Drizzle schema, better-auth's generated tables, the client
      notes/              the example module: the rule (index.ts), Postgres (db.ts), memory (fake.ts)
messages/                 the texts, one file per language
drizzle/                  generated migrations, committed
scripts/                  setup and seed, run with Bun
```

## Thin Routes And Actions

A route reads the request, calls one thing in `$lib/server`, and returns data, a `fail` or a redirect. It holds no
rule: no limit, no check of what a person may write. `src/routes/notes/+page.server.ts` is the shape: the load
calls `listNotes`, the action hands the form's field to `writeNote` and maps its answer to `fail(400, …)` or data.
A route gets its collaborators from `locals`, set in `src/hooks.server.ts`, never by importing the database.

## Server Workflow Shape

A rule takes what it works through as its first argument and the time as its last, so a test gives both
(`writeNote(store, text, now)` in `src/lib/server/notes/index.ts`). It checks its input before it writes, and
answers a refusal as a value (`{ ok: false, problem }`), never as a thrown error: a thrown error is a bug or an
outside service that failed. Several writes that must happen together are one `db.transaction` in the module's
`db.ts`, never in a route.

## Component Boundaries

A component takes plain props and renders; it does not fetch. Every text is a Paraglide message
(`import { m } from '$lib/paraglide/messages'`), keyed in `messages/*.json`, never a literal in markup. Colours come
from the theme's variables (`bg-primary`, `text-muted-foreground`), never a hex in a component. Use a shadcn-svelte
component where there is one; add it rather than writing a widget from scratch. A link goes through `resolve()` from
`$app/paths`.

## Domain Module Boundaries

A module under `src/lib/server/<name>/` has an `index.ts` with its types, the interface it stores through and its
rules; a `db.ts` with the Postgres implementation; and a `fake.ts` with one in memory. Code above a module imports
`index.ts`, never `db.ts`; only `hooks.server.ts` wires the real one. `src/lib/server/notes/` is the example.

## External Integration Boundaries

One adapter per outside system, behind an interface in `$lib/server`, with a fake for tests. The database is
reached through such a module; a mail service, a payment provider or an AI model would be the same: an `index.ts`
with the interface, the real adapter beside it, and `fake.ts`. Secrets come from `$env/dynamic/private`, read on
the server only.

## Database

The schema is `src/lib/server/db/schema.ts`; better-auth's tables are `auth-schema.ts` beside it, written by its CLI
and re-exported. A change to the schema is `bun run db:generate`, a read of the SQL in `drizzle/`, and the
migration committed with the change. Migrations are additive: a column is added, filled, then used; a drop is its
own later change, once nothing reads it.

## Auth

better-auth is installed with no way to sign in turned on. To add one, follow better-auth's guide for it (SSO, a
social provider, a magic link, passkeys): its options or plugin go in `src/lib/server/auth/options.ts`, its client
plugin in `src/lib/auth-client.ts`, then `bun run auth:generate` updates the tables and `bun run db:generate` makes
the migration. `src/lib/server/auth/auth.test.ts` tries e-mail and password and a social provider and fails when
one is on, so change it with the way you add. The session is on `locals.user` and `locals.session` in every load and
action; a page that needs a person checks there and redirects.

## Testing Expectations

`bun run test` runs Vitest with the same Vite config the app builds with, so `$lib` and Paraglide resolve. Bun's own
runner (`bun test`) knows neither. Everything below the routes is tested, test-first: each rule against the fake of
what it works through, next to the code as `*.test.ts`, through its public functions
(`src/lib/server/notes/notes.test.ts`). Expected values are literals, not computed again. Tests never need a
database, the network or Docker; pages are checked by running the app.
