import type { z } from '@hono/zod-openapi';

export const jsonContent = <TSchema>(schema: z.ZodType<TSchema>, description: string, required = false) => ({
	content: {
		'application/json': {
			schema,
		},
	},
	description,
	required,
});
