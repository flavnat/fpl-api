import { integer, jsonb, pgTable } from 'drizzle-orm/pg-core'
import { elements } from '../elements/elements.schema.js'
import { events } from '../events/events.schema.js'

export interface DreamTeamPlayer {
  element: number
  points: number
  position: number
}

export const dreamTeam = pgTable('dream_team', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  event_id: integer('event_id')
    .references(() => events.id)
    .notNull()
    .unique(),

  top_element_id: integer('top_element_id')
    .references(() => elements.id),

  top_element_points: integer('top_element_points'),

  team: jsonb('team')
    .$type<DreamTeamPlayer[]>()
    .notNull()
    .default([]),
})
