import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHook } from '~/libs/open-api/default-hook';
import { errorHandler } from '~/middlewares/error';
import { pinoLogger } from '~/middlewares/logger';
import { notFoundHandler } from '~/middlewares/not-found';
import type { AppBindings, AppOpenAPI } from '~/types/app';

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		defaultHook,
		strict: false,
	});
}

export const createApp = () => {
	const app = createRouter();
	app.use(pinoLogger());
	app.notFound(notFoundHandler);
	app.onError(errorHandler);
	return app;
};

export function createTestApp<R extends AppOpenAPI>(router: R) {
	return createApp().route('/', router);
}
