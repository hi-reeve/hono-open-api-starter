import { apiReference } from '@scalar/hono-api-reference';
import type { AppOpenAPI } from '~/types/app';

import packageJSON from '../../package.json' with { type: 'json' };

export const defineOpenApi = (app: AppOpenAPI) => {
	app.doc('/docs', {
		info: {
			title: 'Hono Open API Starter',
			version: packageJSON.version,
		},
		openapi: '3.0.0',
	});

	app.get(
		'/references',
		apiReference({
			defaultHttpClient: {
				clientKey: 'fetch',
				targetKey: 'javascript',
			},
			layout: 'classic',
			spec: {
				url: '/docs',
			},
			theme: 'kepler',
		}),
	);
};
