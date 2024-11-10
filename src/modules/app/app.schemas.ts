import { z } from '@hono/zod-openapi';

export const indexResponseSchema = z.object({
	message: z.string().openapi({ example: 'Welcome to Hono Open API Starter!' }),
});
