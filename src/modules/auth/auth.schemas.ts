import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '~/db/schema';
import { ERROR_MESSAGES } from '~/utils/error';

export const loginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const loginResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
});

export const createUserRequestSchema = createInsertSchema(user);
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export const invalidCredentialsResponseSchema = z.string()
	.openapi({ example: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS });

export const meResponseSchema = createSelectSchema(user).omit({
	confirmationCode: true,
	createdAt: true,
	password: true,
});

export const refreshTokenRequestSchema = z.object({
	refresh_token: z.string(),
});

export const verifyEmailRequestSchema = z.object({
	token: z.string(),
});