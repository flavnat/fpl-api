import { dreamTeamResolver } from '../modules/dream-team/dream-team.resolver.js'
import { elementTypesResolver } from '../modules/element-types/element-types.resolver.js'
import { elementsResolver } from '../modules/elements/elements.resolver.js'
import { eventWinnersResolver } from '../modules/event-winners/event-winners.resolver.js'
import { eventsResolver } from '../modules/events/events.resolver.js'
import { fixturesResolver } from '../modules/fixtures/fixtures.resolver.js'
import { phasesResolver } from '../modules/phases/phases.resolver.js'
import { teamsResolver } from '../modules/teams/teams.resolver.js'

export const resolvers = {
  Query: {
    ...elementsResolver.Query,
    ...fixturesResolver.Query,
    ...teamsResolver.Query,
    ...eventsResolver.Query,
    ...eventWinnersResolver.Query,
    ...elementTypesResolver.Query,
    ...phasesResolver.Query,
    ...dreamTeamResolver.Query,
  },
  Element: elementsResolver.Element,
  Event: eventsResolver.Event,
  Fixture: fixturesResolver.Fixture,
  StatValue: fixturesResolver.StatValue,
  DreamTeam: dreamTeamResolver.DreamTeam,
  DreamTeamPlayer: dreamTeamResolver.DreamTeamPlayer,
}
