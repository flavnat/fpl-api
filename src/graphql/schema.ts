import { dreamTeamTypeDef } from '../modules/dream-team/dream-team.typeDef.js'
import { elementTypesTypeDef } from '../modules/element-types/element-types.typeDef.js'
import { elementsTypeDef } from '../modules/elements/elements.typeDef.js'
import { eventWinnersTypeDef } from '../modules/event-winners/event-winners.typeDef.js'
import { eventsTypeDef } from '../modules/events/events.typeDef.js'
import { fixturesTypeDef } from '../modules/fixtures/fixtures.typeDef.js'
import { phasesTypeDef } from '../modules/phases/phases.typeDef.js'
import { teamsTypeDef } from '../modules/teams/teams.typeDef.js'
import { filterTypeDefs } from './filter-types.js'

export const schema = [
  `type PaginationMeta {
    total: Int!
    limit: Int!
    offset: Int!
    lastSynced: String
  }`,
  `type Query { _root: String }`,
  filterTypeDefs,
  elementsTypeDef,
  fixturesTypeDef,
  teamsTypeDef,
  eventsTypeDef,
  eventWinnersTypeDef,
  elementTypesTypeDef,
  phasesTypeDef,
  dreamTeamTypeDef,
]
