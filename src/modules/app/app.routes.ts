import { createRoute } from '@hono/zod-openapi';
import { jsonContent } from '~/libs/open-api/helper';
import { successResponseSchema } from '~/libs/open-api/response-schema';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';
import { indexResponseSchema } from './app.schemas';

export const index = createRoute({
	method: 'get',
	path: '/',
	responses: {
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(indexResponseSchema), 'Index API'),
	},
});

export type IndexRoute = typeof index;
