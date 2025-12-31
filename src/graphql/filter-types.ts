/**
 * Shared GraphQL filter and ordering type definitions
 * These enable advanced querying like: where: { form: { gt: 5.0 } }, orderBy: { field: form, direction: DESC }
 */

export const filterTypeDefs = `
  # Comparison operators for Int fields
  input IntFilter {
    eq: Int
    ne: Int
    gt: Int
    gte: Int
    lt: Int
    lte: Int
    in: [Int]
  }

  # Comparison operators for Float fields
  input FloatFilter {
    eq: Float
    ne: Float
    gt: Float
    gte: Float
    lt: Float
    lte: Float
  }

  # Comparison operators for String fields
  input StringFilter {
    eq: String
    ne: String
    contains: String
    startsWith: String
    endsWith: String
    in: [String]
  }

  # Comparison operators for Boolean fields
  input BooleanFilter {
    eq: Boolean
  }

  # Ordering direction
  enum OrderDirection {
    ASC
    DESC
  }

  # Element (Player) filter input
  input ElementFilter {
    id: IntFilter
    code: IntFilter
    web_name: StringFilter
    first_name: StringFilter
    second_name: StringFilter
    team: IntFilter
    element_type: IntFilter
    status: StringFilter
    now_cost: FloatFilter
    total_points: IntFilter
    event_points: IntFilter
    form: FloatFilter
    selected_by_percent: FloatFilter
    goals_scored: IntFilter
    assists: IntFilter
    clean_sheets: IntFilter
    minutes: IntFilter
    bonus: IntFilter
    bps: IntFilter
    expected_goals: FloatFilter
    expected_assists: FloatFilter
    ict_index: FloatFilter
    transfers_in_event: IntFilter
    transfers_out_event: IntFilter
    cost_change_event: IntFilter
    in_dreamteam: BooleanFilter
    chance_of_playing_next_round: IntFilter
  }

  # Element ordering input
  input ElementOrderBy {
    field: ElementOrderField!
    direction: OrderDirection!
  }

  enum ElementOrderField {
    id
    web_name
    now_cost
    total_points
    event_points
    form
    selected_by_percent
    goals_scored
    assists
    clean_sheets
    minutes
    bonus
    bps
    expected_goals
    expected_assists
    ict_index
    transfers_in_event
    transfers_out_event
    cost_change_event
  }

  # Team filter input
  input TeamFilter {
    id: IntFilter
    name: StringFilter
    short_name: StringFilter
    code: IntFilter
    played: IntFilter
    win: IntFilter
    draw: IntFilter
    loss: IntFilter
    points: IntFilter
    position: IntFilter
    strength: IntFilter
    strength_overall_home: IntFilter
    strength_overall_away: IntFilter
    strength_attack_home: IntFilter
    strength_attack_away: IntFilter
    strength_defence_home: IntFilter
    strength_defence_away: IntFilter
  }

  input TeamOrderBy {
    field: TeamOrderField!
    direction: OrderDirection!
  }

  enum TeamOrderField {
    id
    name
    points
    position
    strength
    strength_overall_home
    strength_overall_away
    strength_attack_home
    strength_attack_away
    strength_defence_home
    strength_defence_away
    played
    win
    draw
    loss
  }

  # Event filter input
  input EventFilter {
    id: IntFilter
    name: StringFilter
    finished: BooleanFilter
    is_current: BooleanFilter
    is_next: BooleanFilter
    is_previous: BooleanFilter
    average_entry_score: IntFilter
    highest_score: IntFilter
  }

  input EventOrderBy {
    field: EventOrderField!
    direction: OrderDirection!
  }

  enum EventOrderField {
    id
    name
    deadline_time
    average_entry_score
    highest_score
  }

  # Fixture filter input
  input FixtureFilter {
    id: IntFilter
    code: IntFilter
    event: IntFilter
    team_h: IntFilter
    team_a: IntFilter
    team_h_score: IntFilter
    team_a_score: IntFilter
    finished: BooleanFilter
    finished_provisional: BooleanFilter
    started: BooleanFilter
    team_h_difficulty: IntFilter
    team_a_difficulty: IntFilter
  }

  input FixtureOrderBy {
    field: FixtureOrderField!
    direction: OrderDirection!
  }

  enum FixtureOrderField {
    id
    code
    event
    kickoff_time
    team_h_score
    team_a_score
    team_h_difficulty
    team_a_difficulty
  }

  # Event Winners filter input
  input EventWinnerFilter {
    id: IntFilter
    event_id: IntFilter
    rank: IntFilter
    points: IntFilter
    team_name: StringFilter
    first_name: StringFilter
    last_name: StringFilter
  }

  input EventWinnerOrderBy {
    field: EventWinnerOrderField!
    direction: OrderDirection!
  }

  enum EventWinnerOrderField {
    id
    event_id
    rank
    rank_sort
    points
    team_name
  }

  # Dream Team filter input
  input DreamTeamFilter {
    id: IntFilter
    event_id: IntFilter
    top_element_points: IntFilter
  }

  input DreamTeamOrderBy {
    field: DreamTeamOrderField!
    direction: OrderDirection!
  }

  enum DreamTeamOrderField {
    id
    event_id
    top_element_points
  }
`
