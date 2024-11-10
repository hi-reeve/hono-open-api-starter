import type { Hook } from '@hono/zod-openapi';

import type { GenericResponse } from '~/types/response';
import { HttpErrorPhrases } from '~/utils/error';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';

const defaultHook: Hook<any, any, any, any> = (result, c) => {
	if (!result.success) {
		return c.json<GenericResponse<string>>(
			{
				code: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
				data: result.error.flatten().fieldErrors,
				message: HttpErrorPhrases[HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY],
				status: 'error',
			},
			HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
		);
	}
};

export { defaultHook };
