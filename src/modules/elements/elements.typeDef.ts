export const elementsTypeDef = `
  type Team {
    id: Int
    name: String
    played: Int
    short_name: String
  }
  
  type ElementType {
    id: Int
    singular_name: String
    singular_name_short: String
    plural_name: String
    element_count: Int
  }

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
  }

  extend type Query {
    elements(limit: Int, offset: Int): [Element]
    element(id: Int!): Element
  }
`
