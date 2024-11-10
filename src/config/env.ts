import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

expand(
	config(),
);

export const NODE_ENV_TYPE = {
	DEVELOPMENT: 'development',
	PRODUCTION: 'production',
	TEST: 'test',
} as const;

export type NODE_ENV = (typeof NODE_ENV_TYPE)[keyof typeof NODE_ENV_TYPE];

const EnvSchema = z.object({
	CORS_ORIGIN: z.string().url(),
	DATABASE_URL: z.string(),
	JWT_AUDIENCE: z.string().url(),
	JWT_ISSUER: z.string().url(),
	JWT_SECRET: z.string(),
	LOG_LEVEL: z.enum([
		'fatal',
		'error',
		'warn',
		'info',
		'debug',
		'trace',
		'silent',
	]),
	NODE_ENV: z
		.enum([
			NODE_ENV_TYPE.DEVELOPMENT,
			NODE_ENV_TYPE.PRODUCTION,
			NODE_ENV_TYPE.TEST,
		])
		.default(NODE_ENV_TYPE.DEVELOPMENT),
	PORT: z.coerce.number().default(9999),
});

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line node/prefer-global/process
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error || !env) {
	console.error('❌ Invalid env:');
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	// eslint-disable-next-line node/prefer-global/process
	process.exit(1);
}

export default env!;
