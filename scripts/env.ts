import { randomBytes } from 'node:crypto';

const emptySecret = /^BETTER_AUTH_SECRET=""$/m;

/** A secret for better-auth: 32 random bytes as base64, as `openssl rand -base64 32` makes one. */
export function freshSecret(): string {
	return randomBytes(32).toString('base64');
}

/** The developer's .env: the example as it is, with the secret filled in. */
export function envFromExample(example: string, secret: string): string {
	if (!emptySecret.test(example)) {
		throw new Error('.env.example has no empty BETTER_AUTH_SECRET="" line to fill in');
	}
	return example.replace(emptySecret, `BETTER_AUTH_SECRET="${secret}"`);
}
