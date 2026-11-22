import { fail } from '@sveltejs/kit';
import { listNotes, noteRules, writeNote } from '$lib/server/notes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => ({
	notes: await listNotes(locals.notes),
	maxLength: noteRules.maxLength
});

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const text = (await request.formData()).get('text');
		const written = await writeNote(locals.notes, text, new Date());
		if (!written.ok) return fail(400, { problem: written.problem, text: String(text ?? '') });
		return { written: true };
	}
};
