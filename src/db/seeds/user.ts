import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';
import { db } from '~/config/db';
import * as schema from '~/db/schema';

export const seed = async (length: number) => {
	for (let i = 0; i < length; i++) {
		await db
			.insert(schema.user)
			.values({
				name: faker.person.fullName(),
				email: faker.internet.email(),
				emailVerifiedAt: Date.now(),
				password: await argon2.hash('password'),
				phone: faker.phone.number(),
			})
			.execute();
	}
};
