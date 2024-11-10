import { z } from '@hono/zod-openapi';
import { ERROR_MESSAGES } from '~/utils/error';

export const successResponseSchema = <T>(results: z.ZodType<T>) => {
	return z.object({
		data: results,
		status: z.literal('success'),
	});
};
export const paginationResponseSchema = <T>(results: z.ZodType<T>) => {
	return z.object({
		elements: z.number(),
		pages: z.number(),
		results: z.array(results),
	});
};

export const errorResponseSchema = <T>(messages: string, schema: z.ZodType<T>) => {
	return z.object({
		code: z.number().optional(),
		data: schema,
		message: z.string().openapi({ example: messages }),
		stack: z.string().optional(),
		status: z.literal('error'),
	});
};
export const errorRequestSchema = () => {
	return z.object({
		data: z.record(z.string(), z.array(z.string())),
		message: z.string().openapi({ example: ERROR_MESSAGES.HTTP.UNPROCESSABLE_ENTITY }),
		status: z.literal('error'),
	});
};
