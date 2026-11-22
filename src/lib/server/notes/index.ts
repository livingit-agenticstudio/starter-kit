/**
 * The example page's notes: what a module below the routes looks like. The rule is here, the storage behind
 * `NoteStore`, so the rule is tested against `fake.ts` and the page never touches the database.
 */

export type Note = { id: string; text: string; writtenAt: Date };

/** Where notes are kept: Postgres in `db.ts`, memory in `fake.ts`. */
export interface NoteStore {
	/** The newest notes first, at most `limit`. */
	newest(limit: number): Promise<Note[]>;
	add(note: { text: string; writtenAt: Date }): Promise<Note>;
}

export const noteRules = {
	maxLength: 500,
	shown: 20
} as const;

export type Written = { ok: true; note: Note } | { ok: false; problem: 'empty' | 'too-long' };

export function listNotes(store: NoteStore): Promise<Note[]> {
	return store.newest(noteRules.shown);
}

/** Takes the text as a form sends it, so a missing field is refused here and not in the route. */
export async function writeNote(store: NoteStore, text: unknown, now: Date): Promise<Written> {
	const trimmed = typeof text === 'string' ? text.trim() : '';
	if (trimmed === '') return { ok: false, problem: 'empty' };
	if (trimmed.length > noteRules.maxLength) return { ok: false, problem: 'too-long' };
	return { ok: true, note: await store.add({ text: trimmed, writtenAt: now }) };
}
