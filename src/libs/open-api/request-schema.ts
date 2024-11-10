import { z } from 'zod';

export const headerAuthSchema = () => {
	return z.object({
		Authorization: z.string().openapi({ example: 'Bearer <token>' }),
	});
};
