import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const phases = pgTable('phases', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  start_event: integer('start_event'),
  stop_event: integer('stop_event'),
  highest_score: integer('highest_score'),
})
