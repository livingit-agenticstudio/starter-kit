// What `bun run name` writes: the app's name and the day in the docs' `{{…}}`, the package's name, the app's name in
// messages/, and the app's own README in place of the kit's.

const hostingPending = 'Not chosen yet. The team decides it in a new ADR.';

// The files it changes. Anything else in the repo is left as the kit made it.
export const namedPaths = [
	'README.md',
	'docs/getting-started.md',
	'docs/adr/0001-stack.md',
	'docs/runbook.md',
	'package.json',
	'messages/en.json',
	'messages/sv.json'
];

// The kit's getting-started names the app with this, so a repo where it is gone has been named already.
export const unnamed = '{{APP_NAME}}';

export function named(files: Record<string, string>, name: string, day: string) {
	const answers: Record<string, string> = {
		APP_NAME: name,
		'YYYY-MM-DD': day,
		LANGUAGE: 'Swedish',
		STACK_HOSTING: hostingPending.toLowerCase(),
		RUNBOOK_DEPLOY: hostingPending,
		RUNBOOK_ROLLBACK: 'Not chosen yet, with the deploy.'
	};
	const out: Record<string, string> = {};
	for (const [path, text] of Object.entries(files)) {
		if (path === 'README.md') out[path] = readmeOf(name);
		else if (path === 'package.json') out[path] = withKey(text, 'name', packageNameOf(name));
		// Paraglide reads `{…}` in a message as a variable, so such a name keeps the kit's own.
		else if (path.startsWith('messages/'))
			out[path] = /[{}]/.test(name) ? text : withKey(text, 'app_name', name);
		else
			out[path] = text.replace(
				/\{\{([A-Z_]+|YYYY-MM-DD)\}\}/g,
				(all, key: string) => answers[key] ?? all
			);
	}
	return out;
}

const readmeOf = (name: string) => `# ${name}

Start here: [docs/getting-started.md](docs/getting-started.md). It takes Bun, Docker and two commands.
`;

// The name as npm takes it: lower case, digits and single hyphens, starting with a letter.
export function packageNameOf(name: string) {
	const slug = name
		.normalize('NFKD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^[^a-z]+/, '')
		.slice(0, 50)
		.replace(/-+$/, '');
	return slug || 'app';
}

// A top-level string of a JSON file, the rest as it is, so the file keeps the formatting Prettier checks.
function withKey(text: string, key: string, value: string) {
	const line = new RegExp(`^(\\t"${key}": )"(?:[^"\\\\]|\\\\.)*"`, 'm');
	if (!line.test(text)) throw new Error(`No string at ${key}`);
	return text.replace(line, (_, start: string) => `${start}${JSON.stringify(value)}`);
}
