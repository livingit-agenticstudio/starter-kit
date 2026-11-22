// The first run on a developer's machine: .env from .env.example with a fresh secret, the database in
// Docker, its migrations and the synthetic data. Safe to run again: an .env that exists is left as it is.
//
//   bun run setup
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { envFromExample, freshSecret } from './env';

if (existsSync('.env')) {
	console.log('.env is there already; it is left as it is.');
} else {
	writeFileSync('.env', envFromExample(readFileSync('.env.example', 'utf8'), freshSecret()));
	console.log('Wrote .env from .env.example, with a fresh BETTER_AUTH_SECRET.');
}

// Each step is its own `bun run`, so it reads the .env just written.
for (const script of ['db:start', 'db:migrate', 'db:seed']) {
	const step = spawnSync('bun', ['run', script], { stdio: 'inherit' });
	if (step.status !== 0) {
		console.error(`bun run ${script} failed; see docs/runbook.md.`);
		process.exit(step.status ?? 1);
	}
}

console.log('Ready. Start the app with: bun run dev');
