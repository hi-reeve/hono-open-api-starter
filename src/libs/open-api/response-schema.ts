import { z } from '@hono/zod-openapi';

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
