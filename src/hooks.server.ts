import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { notesIn } from '$lib/server/notes/db';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

// The request's collaborators, so a route reaches the database only through a module below it.
const handleServices: Handle = ({ event, resolve }) => {
	event.locals.notes = notesIn(db);
	return resolve(event);
};

// better-auth answers under /api/auth, and puts the session on locals for every other request.
const handleAuth: Handle = async ({ event, resolve }) => {
	if (!building) {
		const current = await auth.api.getSession({ headers: event.request.headers });
		event.locals.user = current?.user ?? null;
		event.locals.session = current?.session ?? null;
	}
	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleParaglide, handleServices, handleAuth);
