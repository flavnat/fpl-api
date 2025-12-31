# Dream Team

The Dream Team represents the best performing XI players for each gameweek, as selected by the official FPL system based on points scored.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Primary key. |
| `event_id` | `Int` | The gameweek ID (1-38). |
| `top_element_id` | `Int` | The highest scoring player ID for this gameweek. |
| `top_element_points` | `Int` | Points scored by the top player. |
| `team` | `[DreamTeamPlayer]` | Array of 11 players in the dream team. |

### DreamTeamPlayer Object

| Field | Type | Description |
|-------|------|-------------|
| `element` | `Int` | Player ID. |
| `points` | `Int` | Points scored by this player in the gameweek. |
| `position` | `Int` | Position in the formation (1-11). |

## Example Queries

### Get Dream Team for a Specific Gameweek

```graphql
query {
  dream_teams(where: { event_id: { eq: 15 } }) {
    items {
      event_id
      top_element_points
      team
    }
  }
}
```

### Get All Dream Teams

```graphql
query {
  dream_teams {
    items {
      event_id
      top_element_id
      top_element_points
    }
    meta {
      total
    }
  }
}
```

## Use Cases

- **Best XI Analysis**: See which players consistently appear in dream teams across the season.
- **Top Scorer Tracking**: Identify the highest scoring player each gameweek.
- **Historical Performance**: Analyze dream team compositions to inform future transfer decisions.
