import * as schema from '~/db/schema';
// Make sure to install the 'pg' package
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import env from './env';

const connection = new pg.Pool({ connectionString: env.DATABASE_URL });
// You can specify any property from the node-postgres connection options
const db = drizzle({ client: connection, logger: true, schema });

type DB = typeof db;
export { connection, db, DB };
