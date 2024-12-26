import { createApp } from '~/libs/create-app';
import { defineOpenApi } from '~/libs/define-open-api';
import { appRouter } from './modules/app/app.routes';

const app = createApp();

defineOpenApi(app);

const router = [
	appRouter,
] as const;

router.forEach((route) => {
	app.route('/', route);
});

export type AppType = typeof router[number];

export default app;
