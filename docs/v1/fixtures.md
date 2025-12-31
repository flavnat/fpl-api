# Fixtures

Match schedule and live results.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Unique Fixture ID. |
| `event` | `Event` | The Gameweek ID. |
| `code` | `Int` | System Code. |
| `team_h` | `Team` | Home Team. |
| `team_a` | `Team` | Away Team. |
| `team_h_score` | `Int` | Home Goals (null if pre-match). |
| `team_a_score` | `Int` | Away Goals (null if pre-match). |
| `kickoff_time` | `String` | ISO 8601 Date. |
| `minutes` | `Int` | Minutes Played. |
| `started` | `Boolean` | Match has started. |
| `finished` | `Boolean` | Match has fully finished (including bonus). |
| `finished_provisional` | `Boolean` | Match finished on pitch (90 mins), awaiting bonus confirmation. |
| `provisional_start_time` | `Boolean` | If true, kickoff time is not confirmed. |
| `team_h_difficulty` | `Int` | FDR Rating for Home Team (1=Easy, 5=Hard). |
| `team_a_difficulty` | `Int` | FDR Rating for Away Team. |
| `pulse_id` | `Int` | Official Premier League ID. |

## Advanced & Edge Case Queries

### 1. Detect "Bonus Point Waiting Room"
Matches that have finished on the pitch (`finished_provisional: true`) but points aren't finalized (`finished: false`). This is the "Edge Case" window where bonus points are calculated.
```graphql
query {
  fixtures(
    where: { 
      finished_provisional: { eq: true },
      finished: { eq: false }
    }
  ) {
    items {
      team_h { short_name }
      team_a { short_name }
      minutes
    }
  }
}
```

### 2. Postponed Matches (Edge Case)
Matches where the gameweek (`event`) might be null or specialized queries needed. Usually identified by `kickoff_time` changes or `minutes` = 0 long after expected start.
```graphql
query {
  fixtures(where: { 
      event: { eq: null } # Unscheduled fixtures
  }) {
    items {
      team_h { name }
      team_a { name }
    }
  }
}
```

### 3. Blank Gameweek Planning
Find upcoming fixtures with high difficulty (FDR = 5) to avoid transfers.
```graphql
query {
  fixtures(
    where: { 
      team_h_difficulty: { eq: 5 }
    }
  ) {
    items {
      kickoff_time
      team_h { name }
      team_a { name }
    }
  }
}
```
