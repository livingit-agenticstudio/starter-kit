import { describe, expect, it } from 'vitest';
import { envFromExample, freshSecret } from './env';

const example = [
	'# A comment that stays.',
	'DATABASE_URL="postgres://postgres:postgres@localhost:5432/app"',
	'',
	'BETTER_AUTH_SECRET=""',
	'BETTER_AUTH_URL="http://localhost:5173"',
	''
].join('\n');

describe('the .env that setup writes', () => {
	it('is the example with the secret filled in, and nothing else changed', () => {
		expect(envFromExample(example, 'c2VjcmV0')).toBe(
			[
				'# A comment that stays.',
				'DATABASE_URL="postgres://postgres:postgres@localhost:5432/app"',
				'',
				'BETTER_AUTH_SECRET="c2VjcmV0"',
				'BETTER_AUTH_URL="http://localhost:5173"',
				''
			].join('\n')
		);
	});

	it('refuses an example without an empty secret to fill', () => {
		expect(() => envFromExample('DATABASE_URL=""\n', 'c2VjcmV0')).toThrow(/BETTER_AUTH_SECRET/);
	});
});

describe('a fresh secret', () => {
	it('is 32 random bytes, so at least the 32 characters better-auth asks for, and new each time', () => {
		const one = freshSecret();

		expect(Buffer.from(one, 'base64')).toHaveLength(32);
		expect(one.length).toBeGreaterThanOrEqual(32);
		expect(freshSecret()).not.toBe(one);
	});
});
