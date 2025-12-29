# Teams

Represents the 20 Football Clubs.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Unique ID (1-20). |
| `name` | `String` | Full Club Name. |
| `short_name` | `String` | 3-Letter Abbreviation (e.g. ARS, AVL). |
| `code` | `Int` | System Code. |
| `played` | `Int` | Matches Played. |
| `win` | `Int` | Wins. |
| `draw` | `Int` | Draws. |
| `loss` | `Int` | Losses. |
| `points` | `Int` | League Points. |
| `position` | `Int` | Current League Position (0 if season not started). |
| `strength` | `Int` | Overall Strength Rating (Home+Away average). |
| `strength_overall_home` | `Int` | Overall Strength at Home (1000-1400 range). |
| `strength_overall_away` | `Int` | Overall Strength Away. |
| `strength_attack_home` | `Int` | Attack Strength Home. |
| `strength_attack_away` | `Int` | Attack Strength Away. |
| `strength_defence_home` | `Int` | Defence Strength Home. |
| `strength_defence_away` | `Int` | Defence Strength Away. |
| `pulse_id` | `Int` | Official Premier League Pulse ID. |

## Advanced & Edge Case Queries

### 1. Target Weak Defences
Find teams with the lowest defensive strength (best to captain players against them).
```graphql
query {
  teams(
    orderBy: { direction: ASC, field: strength_defence_away }
    first: 3
  ) {
    items {
      name
      strength_defence_away
      points
    }
  }
}
```

### 2. Home Fortresses
Teams that are significantly stronger at home than away (Gap > 100).
*(Note: requires client-side comparison or sophisticated raw SQL, but via API we fetch both fields)*
```graphql
query {
  teams {
    items {
      name
      strength_overall_home
      strength_overall_away
    }
  }
}
```

### 3. Relegation Battle
Teams with low points but high games played.
```graphql
query {
  teams(
    orderBy: { direction: ASC, field: points }
    first: 5
  ) {
    items {
      position
      name
      points
      played
      form
    }
  }
}
```
