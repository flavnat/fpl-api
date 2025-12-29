# Events (Gameweeks)

Represents Gameweeks. Critical for understanding deadlines and the flow of the season.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Gameweek ID (e.g. 1). |
| `name` | `String` | e.g., "Gameweek 1". |
| `deadline_time` | `String` | ISO Date. Deadline for transfers. |
| `is_current` | `Boolean` | Is this the active week? |
| `is_next` | `Boolean` | Is this the upcoming week? |
| `is_previous` | `Boolean` | Is this the one just finished? |
| `finished` | `Boolean` | Status. |
| `data_checked` | `Boolean` | True if points are fully verified/finalized. |
| `average_entry_score` | `Int` | The global average score. |
| `highest_score` | `Int` | The global highest score. |
| `most_selected` | `Element` | Player ID most selected overall. |
| `most_transferred_in` | `Element` | Player ID most bought this week. |
| `top_element` | `Element` | Highest scoring player this week. |
| `transfers_made` | `Int` | Total global transfers made this week. |
| `most_captained` | `Element` | Player ID most captained. |
| `most_vice_captained` | `Element` | Player ID most vice-captained. |

## Advanced & Edge Case Queries

### 1. Double Gameweek Detection
Technically, events are sequential. A "Double Gameweek" usually means teams play twice *within* one event window. To detect this, you query `fixtures` grouped by event. However, querying `Events` with high `average_entry_score` usually indicates a high-scoring double gameweek.

### 2. Deadline approaching?
Find the next gameweek and its deadline.
```graphql
query {
  events(where: { is_next: { eq: true } }) {
    items {
      name
      deadline_time
      most_selected {
        web_name
      }
    }
  }
}
```

### 3. Historical Analysis (Captaincy Fails)
Who was most captained in weeks where the average score was low (< 40)?
```graphql
query {
  events(where: { average_entry_score: { lt: 40 }, finished: { eq: true } }) {
    items {
      name
      average_entry_score
      most_captained {
        web_name
        total_points
      }
    }
  }
}
```
