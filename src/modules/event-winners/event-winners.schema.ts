import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const eventWinners = pgTable('event_winners', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer('event_id').notNull(),
  rank: integer('rank').notNull(),
  rank_sort: integer('rank_sort').notNull(),
  team_name: text('team_name').notNull(),
  entry_id: integer('entry_id').notNull(),
  points: integer('points').notNull(),
  entry_url: text('entry_url').notNull(),
  team_url: text('team_url').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
})
