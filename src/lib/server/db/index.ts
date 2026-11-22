import { env } from '$env/dynamic/private';
import { createDb } from './client';

// One pool for the whole Node process: postgres.js connects at the first query, so the app starts without a
// database and says so on the first page that needs one.
export const db = createDb(env.DATABASE_URL ?? '');
