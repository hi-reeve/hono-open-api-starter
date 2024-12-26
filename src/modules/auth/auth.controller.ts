import type { LoginRoute, LogoutRoute, MeRoute, RefreshTokenRoute, RegisterRoute, VerifyEmailRoute } from './auth.routes';
import argon2 from 'argon2';

import type { AppRouteHandler } from '~/types/app';
import { ERROR_MESSAGES } from '~/utils/error';
import { HttpException } from '~/utils/exception';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';
import { generateAccessAndRefreshToken, revokeToken, verifyToken } from '~/utils/jwt';

import { authServices } from './auth.services';

export const login: AppRouteHandler<LoginRoute> = async (c) => {
	const { email, password } = c.req.valid('json');

	const user = await authServices.findUserByEmail(email);

	if (!user || !(await argon2.verify(user.password, password))) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
		);
	}

	const token = await generateAccessAndRefreshToken({ sub: user.id });

	return c.json({
		data: token,
		status: 'success',
	}, HTTP_STATUS_CODE.OK);
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
	const payload = c.get('jwtPayload');
	await revokeToken(payload.jti);
	return c.body(null, HTTP_STATUS_CODE.NO_CONTENT);
};

export const me: AppRouteHandler<MeRoute> = async (c) => {
	const payload = c.get('jwtPayload');

	const user = await authServices.findUserById(payload.sub);

	if (!user) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	return c.json({
		data: user,
		status: 'success',
	}, HTTP_STATUS_CODE.OK);
};

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
	const body = c.req.valid('json');
	const confirmationCode = crypto.randomUUID();

	const password = await argon2.hash(body.password);
	const [user] = await authServices.createUser({
		...body,
		confirmationCode,
		password,
	});

	if (!user) {
		throw new HttpException(
			HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			ERROR_MESSAGES.USER.FAIL_TO_CREATE,
		);
	}

	return c.json({
		data: user,
		status: 'success',
	}, HTTP_STATUS_CODE.OK);
};

export const refreshToken: AppRouteHandler<RefreshTokenRoute> = async (c) => {
	const payload = c.get('jwtPayload');
	const { refresh_token } = c.req.valid('json');

	const verified = await verifyToken(refresh_token, true);

	if (!verified) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	await revokeToken(`access_token:${payload.jti}`);
	await revokeToken(`refresh_token:${verified.jti}`);

	const token = await generateAccessAndRefreshToken({ sub: verified.sub });

	return c.json({
		data: token,
		status: 'success',
	}, HTTP_STATUS_CODE.OK);
};

export const verifyEmail: AppRouteHandler<VerifyEmailRoute> = async (c) => {
	const { token } = c.req.valid('json');

	const user = await authServices.findUserByConfirmationCode(token);

	if (user?.emailVerifiedAt) {
		throw new HttpException(
			HTTP_STATUS_CODE.CONFLICT,
			ERROR_MESSAGES.USER.EMAIL_ALREADY_VERIFIED,
		);
	}

	if (!user) {
		throw new HttpException(
			HTTP_STATUS_CODE.NOT_FOUND,
			ERROR_MESSAGES.USER.CONFIRMATION_CODE_INVALID,
		);
	}

	await authServices.updateUser(user.id, {
		confirmationCode: null,
		emailVerifiedAt: Math.round(Date.now() / 1000),
	});

	return c.json({
		data: true,
		status: 'success',
	}, HTTP_STATUS_CODE.OK);
};