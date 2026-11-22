// Names the app, once, right after "Use this template" on GitHub (naming.ts says what changes). Commit what it writes.
//
//   bun run name "Kundportalen"
import { readFileSync, writeFileSync } from 'node:fs';
import { named, namedPaths, unnamed } from './naming';

const name = process.argv.slice(2).join(' ').trim();
if (!name) {
	console.error('Give the app a name: bun run name "Kundportalen"');
	process.exit(1);
}
if (!readFileSync('docs/getting-started.md', 'utf8').includes(unnamed)) {
	console.error('The app is named already. Change the name by hand where you want it changed.');
	process.exit(1);
}

const files = Object.fromEntries(namedPaths.map((path) => [path, readFileSync(path, 'utf8')]));
const day = new Date().toISOString().slice(0, 10);
for (const [path, text] of Object.entries(named(files, name, day))) writeFileSync(path, text);
console.log(`Named the app ${name}. Next: bun run setup, as docs/getting-started.md says.`);
