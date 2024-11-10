import type { Context } from 'hono';
import type { HTTPResponseError } from 'hono/types';
import env from '~/config/env';
import type { GenericResponse } from '~/types/response';
import { HttpErrorPhrases, type HttpErrorStatusCode } from '~/utils/error';
import { HttpException } from '~/utils/exception';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';

export function errorHandler(err: Error | HTTPResponseError, c: Context) {
	if (err instanceof HttpException) {
		const statusCode = err.status as HttpErrorStatusCode;
		return c.json<GenericResponse<string>>(
			{
				error: {
					code: err.status,
					details: err.message,
					message: HttpErrorPhrases[statusCode],
					stack:
                        env.NODE_ENV === 'production' ? undefined : err.stack,
				},
				status: 'error',
			},
			err.status,
		);
	}

	return c.json<GenericResponse<string>>({
		error: {
			code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			details: err.message,
			message: HttpErrorPhrases[HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR],
			stack: err.stack,
		},
		status: 'error',
	});
}
