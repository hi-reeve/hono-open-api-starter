import { defineConfig } from 'drizzle-kit';

import env from '~/config/env';

export default defineConfig({
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	dialect: 'postgresql',

	out: './src/db/migrations',
	schema: './src/db/schema/index.ts',
});
