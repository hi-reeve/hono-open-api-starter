import { createClient } from 'redis';

// eslint-disable-next-line antfu/no-top-level-await
const redis = await createClient()
	.on('error', err =>
		// eslint-disable-next-line no-console
		console.log('Redis Client Error', err))
	.connect();

export { redis };
