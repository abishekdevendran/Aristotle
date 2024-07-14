import type { InferSelectModel } from 'drizzle-orm';
import { boolean, pgTable, primaryKey, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

// Users table
export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false)
});

// Profiles table
export const profileTable = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  country: text('country'),
  timeZone: text('time_zone')
});

// Games table
export const gameTable = pgTable('game', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  minPlayers: integer('min_players').notNull(),
  maxPlayers: integer('max_players').notNull(),
  releaseDate: timestamp('release_date', {
    withTimezone: true,
    mode: 'date'
  }).notNull(),
  updateDate: timestamp('update_date', {
    withTimezone: true
  }).notNull(),
});

// Game Instances table
export const gameInstanceTable = pgTable('game_instance', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => gameTable.id),
  hostUserId: text('host_user_id').notNull().references(() => userTable.id),
  name: text('name').notNull(),
  description: text('description'),
  startDate: timestamp('start_date', {
    withTimezone: true
  }).notNull(),
  endDate: timestamp('end_date', {
    withTimezone: true
  }).notNull()
});

// Rarity Enums
export const rarityEnum = pgEnum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary']);

// Achievements table
export const achievementTable = pgTable('achievement', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => gameTable.id),
  name: text('name').notNull(),
  description: text('description'),
  rarity: rarityEnum('rarity').notNull(),
  points: integer('points').notNull()
});

// User Achievements table
export const userAchievementTable = pgTable('user_achievement', {
  userId: text('user_id').notNull().references(() => userTable.id),
  achievementId: text('achievement_id').notNull().references(() => achievementTable.id),
  unlockedAt: timestamp('unlocked_at', {
    withTimezone: true
  }).notNull()
}, (table) => {
  return {
    pk: primaryKey({
      columns: [table.userId, table.achievementId]
    })
  }
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
}, (table) => {
  return {
    pk: primaryKey({
      columns: [table.providerId, table.providerUserId]
    })
  }
});

export type TUserTable = InferSelectModel<typeof userTable>;
export type TProfileTable = InferSelectModel<typeof profileTable>;
export type TGameTable = InferSelectModel<typeof gameTable>;
export type TGameInstanceTable = InferSelectModel<typeof gameInstanceTable>;
export type TAchievementTable = InferSelectModel<typeof achievementTable>;
export type TUserAchievementTable = InferSelectModel<typeof userAchievementTable>;
export type TSessionTable = InferSelectModel<typeof sessionTable>;
export type TOauthAccountTable = InferSelectModel<typeof oauthAccountTable>;
