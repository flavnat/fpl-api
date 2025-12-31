export const dreamTeamTypeDef = `
  type DreamTeamPlayer {
    element: Element
    points: Int
    position: Int
  }

  type DreamTeam {
    id: Int!
    event_id: Int!
    top_element: Element
    top_element_points: Int
    team: [DreamTeamPlayer]
  }

  extend type Query {
    dreamTeam(event_id: Int!): DreamTeam
  }
`
