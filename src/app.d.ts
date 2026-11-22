import type { Auth } from '$lib/server/auth';
import type { NoteStore } from '$lib/server/notes';

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			/** The person signed in, or null: always null until the team turns a way to sign in on. */
			user: Auth['$Infer']['Session']['user'] | null;
			session: Auth['$Infer']['Session']['session'] | null;
			/** What the example page reads and writes notes through, in `$lib/server/notes`. */
			notes: NoteStore;
		}
	}
}

export {};
