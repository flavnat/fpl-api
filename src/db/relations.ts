import { relations } from 'drizzle-orm'
import { elements, elementTypes, events, fixtures, fixtureStats, fixtureStatValues, teams } from './schema.js'

export const elementsRelations = relations(elements, ({ one }) => ({
  team: one(teams, {
    fields: [elements.team],
    references: [teams.id],
  }),
  element_type: one(elementTypes, {
    fields: [elements.element_type],
    references: [elementTypes.id],
  }),
}))

// Events Relations
export const eventsRelations = relations(events, ({ one }) => ({
  most_selected: one(elements, {
    fields: [events.most_selected],
    references: [elements.id],
  }),

  most_transferred_in: one(elements, {
    fields: [events.most_transferred_in],
    references: [elements.id],
  }),

  top_element: one(elements, {
    fields: [events.top_element],
    references: [elements.id],
  }),

  most_captained: one(elements, {
    fields: [events.most_captained],
    references: [elements.id],
  }),

  most_vice_captained: one(elements, {
    fields: [events.most_vice_captained],
    references: [elements.id],
  }),
}))

export const fixturesRelations = relations(fixtures, ({ one, many }) => ({
  event: one(events, {
    fields: [fixtures.event],
    references: [events.id],
  }),
  team_h: one(teams, {
    fields: [fixtures.team_h],
    references: [teams.id],
  }),
  team_a: one(teams, {
    fields: [fixtures.team_a],
    references: [teams.id],
  }),
  stats: many(fixtureStats),
}))

export const fixtureStatsRelations = relations(fixtureStats, ({ one, many }) => ({
  fixture: one(fixtures, {
    fields: [fixtureStats.fixture_id],
    references: [fixtures.id],
  }),
  values: many(fixtureStatValues),
}))

export const fixtureStatValuesRelations = relations(fixtureStatValues, ({ one }) => ({
  statCategory: one(fixtureStats, {
    fields: [fixtureStatValues.stat],
    references: [fixtureStats.id],
  }),
  element: one(elements, {
    fields: [fixtureStatValues.element],
    references: [elements.id],
  }),
}))
