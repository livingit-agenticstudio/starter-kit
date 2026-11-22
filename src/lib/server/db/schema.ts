import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// better-auth's tables, written by its CLI: `bun run auth:generate` after a plugin is added.
export * from './auth-schema';

export const note = pgTable('note', {
	id: uuid('id').primaryKey().defaultRandom(),
	text: text('text').notNull(),
	writtenAt: timestamp('written_at', { withTimezone: true }).notNull()
});
