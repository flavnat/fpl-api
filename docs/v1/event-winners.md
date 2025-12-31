# Event Winners

Event Winners represent the top-performing FPL managers for each gameweek, ranked by points scored in the global league.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Primary key. |
| `event_id` | `Int` | The gameweek ID (1-38). |
| `rank` | `Int` | Position in the global standings for this event. |
| `rank_sort` | `Int` | Tiebreaker ranking. |
| `team_name` | `String` | The manager's team name. |
| `entry_id` | `Int` | The manager's FPL entry ID. |
| `points` | `Int` | Points scored in this gameweek. |
| `entry_url` | `String` | URL to view the manager's entry. |
| `team_url` | `String` | URL to view the manager's team. |
| `first_name` | `String` | Manager's first name. |
| `last_name` | `String` | Manager's last name. |

## Example Queries

### Get Winners for a Specific Gameweek

```graphql
query {
  event_winners(where: { event_id: { eq: 10 } }, orderBy: { rank: ASC }, limit: 10) {
    items {
      rank
      team_name
      points
      first_name
      last_name
    }
  }
}
```

### Get Top Performers Across All Gameweeks

```graphql
query {
  event_winners(orderBy: { points: DESC }, limit: 20) {
    items {
      event_id
      team_name
      points
      rank
    }
    meta {
      total
    }
  }
}
```

## Use Cases

- **Leaderboard Analysis**: Track who scored the highest points each gameweek.
- **Strategy Research**: Study what the top managers are doing each week.
- **Historical Records**: Find the highest individual gameweek scores in history.

## Sync Behavior

The Event Winners sync is optimized for immutability:
- Winners data is only synced once per gameweek (data doesn't change after finalization).
- Already synced gameweeks are cached and skipped on subsequent syncs.
- Future gameweeks that haven't finished return 404 and are automatically skipped.
