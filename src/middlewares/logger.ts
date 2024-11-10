import { createId } from '@paralleldrive/cuid2';
import { pinoLogger as logger } from 'hono-pino';
import { pino } from 'pino';

import pretty from 'pino-pretty';
import env from '~/config/env.js';

export function pinoLogger() {
	return logger({
		http: {
			reqId: () => createId(),
		},
		pino: pino(
			{
				level: env.LOG_LEVEL || 'debug',
			},
			env.NODE_ENV === 'production' ? undefined : pretty(),
		),
	});
}
