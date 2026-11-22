// Synthetic data for local work, never a customer's: two people and a few notes. Safe to run again.
//
//   bun run db:seed
import { createDb } from '../src/lib/server/db/client';
import { note, user } from '../src/lib/server/db/schema';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set; run bun run setup, or see .env.example');

const db = createDb(url);

// People without a way to sign in: they show that the tables are there, for the team's first plugin.
await db
	.insert(user)
	.values([
		{
			id: 'seed-person-1',
			name: 'Exempel Person',
			email: 'person@example.test',
			emailVerified: true
		},
		{
			id: 'seed-person-2',
			name: 'Exempel Kollega',
			email: 'kollega@example.test',
			emailVerified: true
		}
	])
	.onConflictDoNothing();

await db
	.insert(note)
	.values([
		{
			id: '00000000-0000-4000-8000-000000000001',
			text: 'Det här är en anteckning från seed-skriptet.',
			writtenAt: new Date('2026-01-01T09:00:00Z')
		},
		{
			id: '00000000-0000-4000-8000-000000000002',
			text: 'Skriv en egen ovanför, så hamnar den först.',
			writtenAt: new Date('2026-01-01T09:05:00Z')
		}
	])
	.onConflictDoNothing();

await db.close();
console.log('Seeded two people and two notes.');
