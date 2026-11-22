import { betterAuth } from 'better-auth/minimal';
import { memoryAdapter } from 'better-auth/adapters/memory';
import { describe, expect, it } from 'vitest';
import { authOptions } from './options';

/**
 * better-auth is installed with no way to sign in turned on: the team chooses SSO or the plugin the project needs.
 * This runs the kit's configuration on better-auth's memory adapter and asks for each way better-auth has built in,
 * so a way that is turned on by mistake fails here.
 */
function authInMemory() {
	return betterAuth(
		authOptions({
			database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
			secret: 'a-secret-for-tests-only-at-least-32-characters',
			baseURL: 'http://localhost:5173'
		})
	);
}

function post(path: string, body: unknown) {
	return new Request(`http://localhost:5173/api/auth${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', origin: 'http://localhost:5173' },
		body: JSON.stringify(body)
	});
}

describe('the kit’s better-auth', () => {
	it('answers that nobody is signed in', async () => {
		const response = await authInMemory().handler(
			new Request('http://localhost:5173/api/auth/get-session')
		);

		expect(response.status).toBe(200);
		expect(await response.json()).toBeNull();
	});

	it('lets nobody sign up or sign in with an e-mail and a password', async () => {
		const auth = authInMemory();
		const person = { email: 'person@example.test', password: 'a-long-password-1', name: 'Exempel' };

		const signUp = await auth.handler(post('/sign-up/email', person));
		const signIn = await auth.handler(post('/sign-in/email', person));

		expect(signUp.ok).toBe(false);
		expect(signIn.ok).toBe(false);
	});

	it('refuses to start without a secret, rather than sign with better-auth’s known default', () => {
		for (const secret of [undefined, '', '   '])
			expect(() =>
				authOptions({
					database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
					secret,
					baseURL: 'http://localhost:5173'
				})
			).toThrow(/BETTER_AUTH_SECRET is not set/);
	});

	it('has no social provider to sign in with', async () => {
		const response = await authInMemory().handler(
			post('/sign-in/social', { provider: 'github', callbackURL: '/' })
		);

		expect(response.ok).toBe(false);
	});
});
