import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { elements, events, teams } from '../../db/schema.js'

export interface StatDetail {
  value: number
  element: number
}

export interface MatchStat {
  identifier: string
  a: StatDetail[]
  h: StatDetail[]
}

export const fixtures = pgTable('fixtures', {
  id: integer('id').primaryKey(),
  code: integer('code').notNull(),
  event_id: integer('event_id').references(() => events.id),
  team_h: integer('team_h').references(() => teams.id).notNull(),
  team_a: integer('team_a').references(() => teams.id).notNull(),
  team_h_score: integer('team_h_score'),
  team_a_score: integer('team_a_score'),
  finished: boolean('finished').default(false),
  finished_provisional: boolean('finished_provisional').default(false),
  started: boolean('started').default(false),
  kickoff_time: timestamp('kickoff_time'),
  minutes: integer('minutes').default(0),
  provisional_start_time: boolean('provisional_start_time').default(false),
  team_h_difficulty: integer('team_h_difficulty'),
  team_a_difficulty: integer('team_a_difficulty'),
  pulse_id: integer('pulse_id'),
})

export const fixtureStats = pgTable('fixture_stats', {
  id: integer('id').primaryKey(),
  fixture_id: integer('fixture_id')
    .references(() => fixtures.id, { onDelete: 'cascade' })
    .notNull(),
  identifier: text('identifier').notNull(),
})

export const fixtureStatValues = pgTable('fixture_stat_values', {
  id: integer('id').primaryKey(),
  stat: integer('stat_id')
    .references(() => fixtureStats.id, { onDelete: 'cascade' })
    .notNull(),

  element: integer('element_id')
    .references(() => elements.id)
    .notNull(),

  value: integer('value').notNull(),
  side: text('side', { enum: ['a', 'h'] }).notNull(),
})
