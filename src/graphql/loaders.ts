import { elementsLoaders } from '../modules/elements/elements.loader.js'
import { eventsLoaders } from '../modules/events/events.loader.js'
import { fixturesLoaders } from '../modules/fixtures/fixtures.loader.js'

export const loaders = {
  ...elementsLoaders,
  ...fixturesLoaders,
  ...eventsLoaders,
}
