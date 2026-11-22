import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/** What a caller may set on the connections; none of it is needed on Node, where postgres.js's defaults hold. */
export type DbOptions = Pick<
	postgres.Options<Record<string, postgres.PostgresType>>,
	'max' | 'fetch_types'
>;

/** A database on a connection string. The app makes one (`index.ts`); the scripts make their own. */
export function createDb(connectionString: string, options: DbOptions = {}) {
	const client = postgres(connectionString, options);
	return Object.assign(drizzle(client, { schema }), {
		/** Ends the connections, for a script that is done. */
		close: () => client.end()
	});
}

export type Database = ReturnType<typeof createDb>;
