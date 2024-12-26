import type { CreateUserRequest } from './auth.schemas';
import { eq } from 'drizzle-orm';
import { db } from '~/config/db';
import { user } from '~/db/schema';

export const authServices = {
	createUser: async (payload: CreateUserRequest) => {
		return db.insert(user).values(payload).returning();
	},
	findUserByConfirmationCode: async (code: string) => {
		return db.query.user.findFirst({
			where: (user, { eq }) => eq(user.confirmationCode, code),
		});
	},
	findUserByEmail: async (email: string) => {
		return db.query.user.findFirst({
			where: (user, { eq }) => eq(user.email, email),
		});
	},
	findUserById: async (id: string) => {
		return db.query.user.findFirst({
			columns: {
				id: true,
				name: true,
				email: true,
				emailVerifiedAt: true,
				phone: true,
				updatedAt: true,

			},
			where: (user, { eq }) => eq(user.id, id),
		});
	},

	updateUser: async (id: string, payload: Partial<CreateUserRequest>) => {
		return db
			.update(user)
			.set(payload)
			.where(eq(user.id, id))
			.returning();
	},
};