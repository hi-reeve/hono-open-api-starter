import { createMiddleware } from 'hono/factory';
import { ERROR_MESSAGES } from '~/utils/error';
import { HttpException } from '~/utils/exception';

import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';
import { verifyToken } from '~/utils/jwt';

export const auth = createMiddleware(async (c, next) => {
	const credentials = c.req.raw.headers.get('Authorization');
	const parts = credentials?.split(/\s+/);
	let token;

	if (parts?.length !== 2) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}
	else {
		token = parts[1];
	}

	if (!token) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	const payload = await verifyToken(token);
	if (!payload) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	c.set('jwtPayload', payload);

	return next();
});
