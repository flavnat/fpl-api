export const teamsTypeDef = `
  type Team {
    id: Int!
    code: Int
    name: String!
    short_name: String
    played: Int
    win: Int
    loss: Int
    draw: Int
    points: Int
    position: Int
    form: String
    strength: Int
    unavailable: Boolean
    
    strength_overall_home: Int
    strength_overall_away: Int
    strength_attack_home: Int
    strength_attack_away: Int
    strength_defence_home: Int
    strength_defence_away: Int
  }

  type TeamsResponse {
    items: [Team]!
    meta: PaginationMeta!
  }

  extend type Query {
    teams(
      where: TeamFilter
      orderBy: TeamOrderBy
      first: Int
      limit: Int
      offset: Int
    ): TeamsResponse
    team(id: Int!): Team
  }
`
