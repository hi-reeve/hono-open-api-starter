import { createRoute, z } from '@hono/zod-openapi';
import { jsonContent } from '~/libs/open-api/helper';
import { errorRequestSchema, errorResponseSchema, successResponseSchema } from '~/libs/open-api/response-schema';
import { auth } from '~/middlewares/auth';
import { ERROR_MESSAGES } from '~/utils/error';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';
import { createUserRequestSchema, loginRequestSchema, loginResponseSchema, meResponseSchema, refreshTokenRequestSchema, verifyEmailRequestSchema } from './auth.schemas';
import * as controller from './auth.controller';
import { createRouter } from '~/libs/create-app';
export const login = createRoute({
	method: 'post',
	path: '/login',
	request: { body: jsonContent(loginRequestSchema, 'Login Body') },
	responses: {
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(loginResponseSchema), 'Login Api'),
		[HTTP_STATUS_CODE.UNAUTHORIZED]: jsonContent(
			errorResponseSchema(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, z.null()),
			'Invalid Credentials',
		),
		[HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY]: jsonContent(
			errorRequestSchema(),
			'Request Validation Error',
		),
	},
	tags: ['Auth'],
});

export const logout = createRoute({
	method: 'post',
	middleware: [auth] as const,
	path: '/logout',
	responses: {
		[HTTP_STATUS_CODE.NO_CONTENT]: { description: 'Success' },
	},
	tags: ['Auth'],
});

export const me = createRoute({
	method: 'get',
	middleware: [auth] as const,
	path: '/me',
	responses: {
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(meResponseSchema), 'Me'),
		[HTTP_STATUS_CODE.UNAUTHORIZED]: jsonContent(
			errorResponseSchema(ERROR_MESSAGES.TOKEN.INVALID, z.null()),
			'Invalid Token',
		),
	},
	tags: ['Auth'],
});

export const register = createRoute({
	method: 'post',
	path: '/register',
	request: { body: jsonContent(createUserRequestSchema, 'Register Body') },
	responses: {
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(meResponseSchema), 'Register Api'),
		[HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY]: jsonContent(
			errorRequestSchema(),
			'Request Validation Error',
		),
	},
	tags: ['Auth'],
});

export const refreshToken = createRoute({
	method: 'post',
	middleware: [auth] as const,
	path: '/refresh-token',
	request: {
		body: jsonContent(refreshTokenRequestSchema, 'Refresh Token Body'),
	},
	responses: {
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(loginResponseSchema), 'Refresh Token Api'),
		[HTTP_STATUS_CODE.UNAUTHORIZED]: jsonContent(
			errorResponseSchema(ERROR_MESSAGES.TOKEN.INVALID, z.null()),
			'Invalid Token',
		),
		[HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY]: jsonContent(
			errorRequestSchema(),
			'Request Validation Error',
		),
	},
	tags: ['Auth'],
});

export const verifyEmail = createRoute({
	method: 'put',
	path: '/verify-email',
	request: { body: jsonContent(verifyEmailRequestSchema, 'Verify Email Body') },
	responses: {
		[HTTP_STATUS_CODE.CONFLICT]: jsonContent(errorResponseSchema(ERROR_MESSAGES.USER.EMAIL_ALREADY_VERIFIED, z.null()), 'Email Already Verified'),
		[HTTP_STATUS_CODE.NOT_FOUND]: jsonContent(errorResponseSchema(ERROR_MESSAGES.HTTP.NOT_FOUND, z.null()), 'confirmation code not found'),
		[HTTP_STATUS_CODE.OK]: jsonContent(successResponseSchema(z.boolean()), 'Verify Email Api'),
		[HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY]: jsonContent(
			errorRequestSchema(),
			'Request Validation Error',
		),
	},
	tags: ['Auth'],
});

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;
export type MeRoute = typeof me;
export type RefreshTokenRoute = typeof refreshToken;
export type VerifyEmailRoute = typeof verifyEmail;

export const authRouter = createRouter()
	.basePath('/auth')
	.openapi(register, controller.register)
	.openapi(login, controller.login)
	.openapi(me, controller.me)
	.openapi(logout, controller.logout)
	.openapi(refreshToken, controller.refreshToken)
	.openapi(verifyEmail, controller.verifyEmail);