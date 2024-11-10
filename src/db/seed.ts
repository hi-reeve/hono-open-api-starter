import type { Table } from 'drizzle-orm';
import { getTableName, sql } from 'drizzle-orm';

import { connection, db, type DB } from '~/config/db';
import * as schema from '~/db/schema';
import * as seed from './seeds';

async function resetTable(db: DB, table: Table) {
	return db.execute(
		sql.raw(
			`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`,
		),
	);
}

for (const table of [schema.user]) {
	await resetTable(db, table);
}

await seed.user(100);

await connection.end();
