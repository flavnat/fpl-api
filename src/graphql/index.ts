import { elementsResolver } from '../modules/elements/elements.resolver.js'
import { elementsTypeDef } from '../modules/elements/elements.typeDef.js'

const baseTypeDefs = `
  type Query {
    _root: String
  }
`

export const schema = [baseTypeDefs, elementsTypeDef]

export const resolvers = {
  Query: {
    ...elementsResolver.Query,
  },
  Element: elementsResolver.Element,
}
