import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';
import type { JwtPayload } from '~/utils/jwt';

export type AppBindings = {
	Variables: {
		logger: PinoLogger;
		jwtPayload: JwtPayload;
	};
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<Route extends RouteConfig> = RouteHandler<Route, AppBindings>;
