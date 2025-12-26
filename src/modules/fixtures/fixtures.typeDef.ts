export const fixturesTypeDef = `
  type StatValue {
    value: Int
    element: Element
  }

  type FixtureStat {
    identifier: String
    h: [StatValue]
    a: [StatValue]
  }

  type Fixture {
    id: Int!
    code: Int!
    event: Int
    team_h: Team
    team_a: Team
    team_h_score: Int
    team_a_score: Int
    finished: Boolean
    finished_provisional: Boolean
    started: Boolean
    kickoff_time: String
    minutes: Int
    provisional_start_time: Boolean
    team_h_difficulty: Int
    team_a_difficulty: Int
    pulse_id: Int
    stats: [FixtureStat]
  }

  type FixturesResponse {
    items: [Fixture]!
    meta: PaginationMeta!
  }

  extend type Query {
    fixture(id: Int!): Fixture
    fixtures(limit: Int, offset: Int, event: Int): FixturesResponse
  }
`
