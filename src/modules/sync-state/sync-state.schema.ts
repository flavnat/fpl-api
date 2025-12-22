import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const syncState = pgTable('sync_state', {
  key: text('key').primaryKey(),
  syncedAt: timestamp('synced_at', { withTimezone: true }).notNull(),
})
