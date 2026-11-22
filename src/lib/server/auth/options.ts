import type { BetterAuthOptions } from 'better-auth/minimal';

type AuthSettings = {
	database: BetterAuthOptions['database'];
	secret: string | undefined;
	baseURL: string | undefined;
};

/**
 * better-auth's secret, refused when it is empty. Without one, better-auth signs sessions with a constant that every
 * copy of better-auth knows, and it only refuses that itself where NODE_ENV is production. So the app stops here
 * instead, wherever it runs: locally `bun run setup` writes one to `.env`.
 */
export function requiredSecret(secret: string | undefined): string {
	if (!secret?.trim())
		throw new Error(
			'BETTER_AUTH_SECRET is not set. Set it in .env locally (bun run setup writes one), or where the app runs.'
		);
	return secret;
}

/**
 * The kit's better-auth, apart from SvelteKit, so a test can run it on the memory adapter. No way to sign in is
 * turned on: the team adds SSO or the plugin the project needs here (docs/adr/0001-stack.md). It throws when the
 * secret is empty (`requiredSecret`).
 */
export function authOptions({ database, secret, baseURL }: AuthSettings): BetterAuthOptions {
	return {
		database,
		secret: requiredSecret(secret),
		baseURL,
		emailAndPassword: { enabled: false }
	};
}
