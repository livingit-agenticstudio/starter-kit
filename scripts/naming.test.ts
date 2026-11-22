import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { named, namedPaths, packageNameOf, unnamed } from './naming';

const kit = Object.fromEntries(namedPaths.map((path) => [path, readFileSync(path, 'utf8')]));

describe('naming the app', () => {
	it('starts from a kit that is not named yet', () => {
		expect(kit['docs/getting-started.md']).toContain(unnamed);
	});

	it('leaves no placeholder in any file it changes', () => {
		const out = named(kit, 'Kundportalen', '2026-11-22');
		for (const text of Object.values(out)) expect(text).not.toMatch(/\{\{[A-Z_-]+\}\}/);
	});

	it('puts the name and the day in the docs', () => {
		const out = named(kit, 'Kundportalen', '2026-11-22');
		expect(out['docs/getting-started.md']).toContain('Kundportalen starts from');
		expect(out['docs/adr/0001-stack.md']).toContain('**Status:** Accepted - 2026-11-22');
		expect(out['README.md']).toMatch(/^# Kundportalen\n/);
	});

	it('names the package and the app in both languages', () => {
		const out = named(kit, 'Kundportalen', '2026-11-22');
		expect(JSON.parse(out['package.json']).name).toBe('kundportalen');
		expect(JSON.parse(out['messages/sv.json']).app_name).toBe('Kundportalen');
		expect(JSON.parse(out['messages/en.json']).app_name).toBe('Kundportalen');
	});

	it('keeps the messages as they are for a name Paraglide would read as a variable', () => {
		const out = named(kit, 'App {beta}', '2026-11-22');
		expect(out['messages/sv.json']).toBe(kit['messages/sv.json']);
	});
});

describe('the package name', () => {
	it('is lower case with single hyphens and no accents', () => {
		expect(packageNameOf('Åre Skidskola 2')).toBe('are-skidskola-2');
	});

	it('starts with a letter, and is app when nothing is left', () => {
		expect(packageNameOf('2 Go')).toBe('go');
		expect(packageNameOf('123')).toBe('app');
	});
});
