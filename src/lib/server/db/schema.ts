import { boolean, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: text('id').primaryKey(),
  name: text('name').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false)
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const oauthAccountTable = pgTable('oauth_account', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id').notNull().references(() => userTable.id)
},(table)=>{
  return {
    pk: primaryKey({
      columns: [table.providerId, table.providerUserId]
    })
  }
});
