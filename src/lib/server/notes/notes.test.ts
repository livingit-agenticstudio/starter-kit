import { describe, expect, it } from 'vitest';
import { createFakeNotes } from './fake';
import { listNotes, writeNote } from './index';

const morning = new Date('2026-10-09T08:00:00Z');
const noon = new Date('2026-10-09T12:00:00Z');

describe('writing a note', () => {
	it('keeps the text without the space around it, at the time it was written', async () => {
		const notes = createFakeNotes();

		const written = await writeNote(notes, '  Ring leverantören  ', morning);

		expect(written).toEqual({
			ok: true,
			note: { id: expect.any(String), text: 'Ring leverantören', writtenAt: morning }
		});
		expect(await listNotes(notes)).toEqual([written.ok && written.note]);
	});

	it('refuses an empty note, and one of only spaces, and keeps nothing', async () => {
		const notes = createFakeNotes();

		expect(await writeNote(notes, '', morning)).toEqual({ ok: false, problem: 'empty' });
		expect(await writeNote(notes, '   ', morning)).toEqual({ ok: false, problem: 'empty' });
		expect(await writeNote(notes, null, morning)).toEqual({ ok: false, problem: 'empty' });
		expect(await listNotes(notes)).toEqual([]);
	});

	it('refuses a note longer than 500 characters, and takes one of exactly 500', async () => {
		const notes = createFakeNotes();

		expect(await writeNote(notes, 'a'.repeat(501), morning)).toEqual({
			ok: false,
			problem: 'too-long'
		});
		expect((await writeNote(notes, 'a'.repeat(500), morning)).ok).toBe(true);
	});
});

describe('the list of notes', () => {
	it('shows the newest first', async () => {
		const notes = createFakeNotes();
		await writeNote(notes, 'Först', morning);
		await writeNote(notes, 'Sedan', noon);

		expect((await listNotes(notes)).map((note) => note.text)).toEqual(['Sedan', 'Först']);
	});

	it('shows the 20 newest', async () => {
		const notes = createFakeNotes();
		for (let minute = 0; minute < 25; minute++) {
			await writeNote(notes, `Anteckning ${minute}`, new Date(morning.getTime() + minute * 60_000));
		}

		const shown = await listNotes(notes);

		expect(shown).toHaveLength(20);
		expect(shown[0].text).toBe('Anteckning 24');
		expect(shown[19].text).toBe('Anteckning 5');
	});
});
