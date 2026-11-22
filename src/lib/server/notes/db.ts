import { desc } from 'drizzle-orm';
import type { Database } from '../db/client';
import { note } from '../db/schema';
import type { NoteStore } from './index';

/** Notes in Postgres, the note table. */
export function notesIn(db: Database): NoteStore {
	return {
		async newest(limit) {
			return db.select().from(note).orderBy(desc(note.writtenAt)).limit(limit);
		},
		async add(values) {
			const [added] = await db.insert(note).values(values).returning();
			return added;
		}
	};
}
