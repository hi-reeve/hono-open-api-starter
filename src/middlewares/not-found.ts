import type { Context } from 'hono';
import type { GenericResponse } from '~/types/response';
import { HttpErrorPhrases } from '~/utils/error';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';

export function notFoundHandler(c: Context) {
	return c.json<GenericResponse<string>>(
		{
			code: HTTP_STATUS_CODE.NOT_FOUND,
			message: HttpErrorPhrases[HTTP_STATUS_CODE.NOT_FOUND],
			status: 'error',
		},
		HTTP_STATUS_CODE.NOT_FOUND,
	);
}
