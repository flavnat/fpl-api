import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { elements } from '../../db/schema.js'

export interface ChipPlay {
  chip_name: string
  num_played: number
}

export interface EventOverrides {
  rules: Record<string, any>
  scoring: Record<string, any>
  element_types: any[]
  pick_multiplier: number | null
}

export interface TopElementInfo {
  id: number
  points: number
}

export const events = pgTable('events', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  deadline_time: timestamp('deadline_time'),
  release_time: text('release_time'),
  average_entry_score: integer('average_entry_score'),
  finished: boolean('finished'),
  data_checked: boolean('data_checked'),
  highest_scoring_entry: integer('highest_scoring_entry'),
  deadline_time_epoch: integer('deadline_time_epoch'),
  deadline_time_game_offset: integer('deadline_time_game_offset'),
  highest_score: integer('highest_score'),
  is_previous: boolean('is_previous'),
  is_current: boolean('is_current'),
  is_next: boolean('is_next'),
  cup_leagues_created: boolean('cup_leagues_created'),
  h2h_ko_matches_created: boolean('h2h_ko_matches_created'),
  can_enter: boolean('can_enter'),
  can_manage: boolean('can_manage'),
  released: boolean('released'),
  ranked_count: integer('ranked_count'),
  overrides: jsonb('overrides')
    .$type<EventOverrides>()
    .notNull()
    .default({
      rules: {},
      scoring: {},
      element_types: [],
      pick_multiplier: null,
    }),
  chip_playes: jsonb('chip_plays')
    .$type<ChipPlay[]>()
    .notNull()
    .default([]),
  most_selected: integer('most_selected').references(() => elements.id),
  most_transferred_in: integer('most_transferred_in').references(() => elements.id),
  top_element: integer('top_element').references(() => elements.id),
  top_element_info: jsonb('top_element_info')
    .$type<TopElementInfo>(),
  transfers_made: integer('transfers_made'),
  most_captained: integer('most_captained').references(() => elements.id),
  most_vice_captained: integer('most_vice_captained').references(() => elements.id),
})
