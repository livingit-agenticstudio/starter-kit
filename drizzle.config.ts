import { defineConfig } from 'drizzle-kit';

// Generating a migration reads only the schema; applying one (db:migrate) needs DATABASE_URL.
export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL ?? '' },
	verbose: true,
	strict: true
});
