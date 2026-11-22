import type { Note, NoteStore } from './index';

/** Notes in memory, for tests. */
export function createFakeNotes(): NoteStore {
	const kept: Note[] = [];
	return {
		async newest(limit) {
			return [...kept]
				.sort((a, b) => b.writtenAt.getTime() - a.writtenAt.getTime())
				.slice(0, limit)
				.map((note) => ({ ...note }));
		},
		async add({ text, writtenAt }) {
			const note = { id: crypto.randomUUID(), text, writtenAt };
			kept.push(note);
			return { ...note };
		}
	};
}
