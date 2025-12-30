export const eventWinnersTypeDef = `
  type EventWinner {
    id: Int!
    event_id: Int!
    rank: Int!
    rank_sort: Int!
    team_name: String!
    entry_id: Int!
    points: Int!
    entry_url: String!
    team_url: String!
    first_name: String!
    last_name: String!
  }

  type EventWinnersResponse {
    items: [EventWinner!]!
    meta: PaginationMeta!
  }

  extend type Query {
    eventWinners(event_id: Int!, limit: Int, offset: Int): EventWinnersResponse!
    eventWinner(id: Int!): EventWinner
  }
`
