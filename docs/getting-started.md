# Getting started

{{APP_NAME}} starts from [Livingit's starter kit](https://github.com/livingit-agenticstudio/starter-kit): a SvelteKit app
with Postgres, better-auth and an example page, which runs on your machine from two commands. Why this stack: [ADR 0001](adr/0001-stack.md).

## What you need

- [Bun](https://bun.sh) 1.3 or later.
- [Docker](https://docs.docker.com/get-docker/) with Compose, running. Postgres runs in it for local work.

## Two commands

```sh
bun install
bun run setup   # .env with a fresh secret, Postgres in Docker, migrations, synthetic data
bun run dev     # the app at http://localhost:5173
```

`bun run setup` is safe to run again: an `.env` that exists is left as it is, and the seed adds nothing twice.

## What is there

- **The start page** (`/`) and **Anteckningar** (`/notes`), the example of a page that reads and writes through a
  module on the server, with a test against a fake. Replace it with the first thing the app does.
- **Postgres** through Drizzle: the schema in `src/lib/server/db/schema.ts`, the migrations in `drizzle/`.
- **better-auth**, installed as its guide says, with its tables, its secret and its handler at `/api/auth`. No way
  to sign in is turned on: the team chooses SSO or the plugin the project needs
  ([patterns](engineering/patterns.md#auth)).
- **Claude Code skills** in `.claude/`: `work-an-issue` and `write-an-issue` for the customer's issues through Agentic
  Studio's MCP tools, and an `issue-reviewer` agent. They are plain files; change them as the team works. The MCP
  address and the agent kit are under Agenter in Agentic Studio.
- **Texts** in `messages/`, through Paraglide, never written in a component.

## Before a pull request

```sh
bun run test    # Vitest, no database or network
bun run lint    # Prettier and ESLint
bun run check   # Paraglide and svelte-check
bun run build   # vite build, the app as it runs once deployed
```

Where code goes: [engineering/patterns.md](engineering/patterns.md). Commands for the database and known failures:
[runbook.md](runbook.md).
