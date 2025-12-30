export const phasesTypeDef = `
  type Phase {
    id: Int!
    name: String!
    start_event: Int
    stop_event: Int
    highest_score: Int
  }

  type PhasesResponse {
    items: [Phase!]!
    meta: PaginationMeta!
  }

  extend type Query {
    phases(limit: Int, offset: Int): PhasesResponse!
    phase(id: Int!): Phase
  }
`
