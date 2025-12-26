import { elementTypesResolver } from '../modules/element-types/element-types.resolver.js'
import { elementsResolver } from '../modules/elements/elements.resolver.js'
import { eventsResolver } from '../modules/events/events.resolver.js'
import { fixturesResolver } from '../modules/fixtures/fixtures.resolver.js'
import { teamsResolver } from '../modules/teams/teams.resolver.js'

export const resolvers = {
  Query: {
    ...elementsResolver.Query,
    ...fixturesResolver.Query,
    ...teamsResolver.Query,
    ...eventsResolver.Query,
    ...elementTypesResolver.Query,
  },
  Element: elementsResolver.Element,
}
