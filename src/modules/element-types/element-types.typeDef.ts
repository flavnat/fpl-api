export const elementTypesTypeDef = `
  type ElementType {
    id: Int!
    plural_name: String!
    plural_name_short: String!
    singular_name: String!
    singular_name_short: String!
    squad_select: Int
    squad_min_select: Int
    squad_max_select: Int
    squad_min_play: Int
    squad_max_play: Int
    element_count: Int
  }

  extend type Query {
    element_types: [ElementType]
    element_type(id: Int!): ElementType
  }
`
