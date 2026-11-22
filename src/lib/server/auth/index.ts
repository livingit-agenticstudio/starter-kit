import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth/minimal';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '../db';
import * as schema from '../db/schema';
import { authOptions } from './options';

/** The app's better-auth, as its installation guide sets it up. Its CLI reads this file (`auth:generate`). */
export const auth = betterAuth({
	...authOptions({
		database: drizzleAdapter(db, { provider: 'pg', schema }),
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL
	}),
	// Sets better-auth's cookies from a form action; better-auth asks for it last among the plugins.
	plugins: [sveltekitCookies(getRequestEvent)]
});

export type Auth = typeof auth;
