export const elementsTypeDef = `

  type Element {
    id: Int!
    code: Int!
    first_name: String
    second_name: String
    web_name: String
    
    # Virtual Fields (Calculated in Resolvers)
    full_name: String
    formatted_cost: String
    
    now_cost: Float
    team: Team
    element_type: ElementType
    status: String
    news: String
    
    total_points: Int
    goals_scored: Int
    assists: Int
    clean_sheets: Int
    minutes: Int
    bonus: Int
    bps: Int
    
    # Underlying Stats
    expected_goals: Float
    expected_assists: Float
    ict_index: Float
    form: Float
    points_per_game: Float
    selected_by_percent: Float
    transfers_in_event: Int
    transfers_out_event: Int
    cost_change_event: Int
    in_dreamteam: Boolean
    chance_of_playing_next_round: Int
  }

  type ElementsResponse {
    items: [Element]!
    meta: PaginationMeta!
  }

  extend type Query {
    elements(
      where: ElementFilter
      orderBy: ElementOrderBy
      first: Int
      limit: Int
      offset: Int
    ): ElementsResponse
    element(id: Int!): Element
  }
`
