export const eventsTypeDef = `
  type ChipPlay {
    chip_name: String
    num_played: Int
  }

  type TopElementInfo {
    id: Int
    points: Int
  }

  type Event {
    id: Int!
    name: String!
    deadline_time: String
    average_entry_score: Int
    finished: Boolean
    is_previous: Boolean
    is_current: Boolean
    is_next: Boolean
    highest_score: Int
    chip_playes: [ChipPlay]
    top_element_info: TopElementInfo
    

    most_selected: Element
    most_transferred_in: Element
    top_element: Element
    most_captained: Element
    most_vice_captained: Element
  }

  type EventsResponse {
    items: [Event]!
    meta: PaginationMeta!
  }

  extend type Query {
    events(limit: Int, offset: Int): EventsResponse
    event(id: Int!): Event
    currentEvent: Event
  }
`
