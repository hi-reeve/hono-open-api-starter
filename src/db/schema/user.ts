import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

const user = pgTable('users', {
	id: varchar('id', { length: 255 })
		.primaryKey()
		.notNull()
		.$default(() => createId()),
	name: varchar('name', { length: 255 }).notNull(),
	confirmationCode: varchar('confirmation_code', { length: 255 }),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`extract(epoch from now())`),
	email: varchar('email', { length: 255 }).notNull().unique(),
	emailVerifiedAt: integer('email_verified_at'),
	password: varchar('password', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull().unique(),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`extract(epoch from now())`),
});

export { user };
