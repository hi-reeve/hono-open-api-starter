import type { IndexRoute } from './app.routes';
import type { AppRouteHandler } from '~/types/app';

export const index: AppRouteHandler<IndexRoute> = async c => c.json({
	data: { message: 'Welcome to Hono Open API Starter!' },
	status: 'success',
});
