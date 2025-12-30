import * as elementTypes from '../modules/element-types/element-types.schema.js'
import * as elements from '../modules/elements/elements.schema.js'
import * as events from '../modules/events/events.schema.js'
import * as fixtures from '../modules/fixtures/fixtures.schema.js'
import * as phases from '../modules/phases/phases.schema.js'
import * as syncState from '../modules/sync-state/sync-state.schema.js'
import * as teams from '../modules/teams/teams.schema.js'

export * from '../modules/element-types/element-types.schema.js'
export * from '../modules/elements/elements.schema.js'
export * from '../modules/events/events.schema.js'
export * from '../modules/fixtures/fixtures.schema.js'
export * from '../modules/phases/phases.schema.js'
export * from '../modules/sync-state/sync-state.schema.js'
export * from '../modules/teams/teams.schema.js'

export const schema = {
  ...teams,
  ...elementTypes,
  ...elements,
  ...events,
  ...fixtures,
  ...phases,
  ...syncState,
}
