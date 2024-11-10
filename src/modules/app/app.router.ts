import { createRouter } from '~/libs/create-app';
import * as controller from './app.controller';
import * as routes from './app.routes';

export const appRouter = createRouter()
	.openapi(routes.index, controller.index);
