# Elements (Players)

Entries for all players in the Premier League. This is the most data-rich resource in the API.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Unique identifier for the player. |
| `web_name` | `String` | Name displayed on FPL site (e.g., "Haaland"). |
| `first_name` | `String` | First name. |
| `second_name` | `String` | Surname. |
| `code` | `Int` | Unique code for the player across seasons. |
| `team` | `Team` | Relationship to the Team object. |
| `element_type` | `ElementType` | Position (1=GKP, 2=DEF, 3=MID, 4=FWD). |
| `status` | `String` | Availability status (`a`=available, `d`=doubtful, `i`=injured, `u`=unavailable, `s`=suspended). |
| `news` | `String` | Text description of injury/status. |
| `now_cost` | `Float` | Current price (e.g., `14.0` £m). |
| `cost_change_event` | `Int` | Price change during this gameweek. |
| `cost_change_start` | `Int` | Total price change since start of season. |
| `total_points` | `Int` | Total points scored this season. |
| `event_points` | `Int` | Points scored in the current/latest gameweek. |
| `points_per_game` | `Float` | Average points per match played. |
| `selected_by_percent` | `Float` | Percentage of FPL teams owning this player. |
| `form` | `Float` | Calculate form rating over last 30 days. |
| `value_form` | `Float` | Form divided by Price. |
| `value_season` | `Float` | Total Points divided by Price. |
| `ep_this` | `Float` | Expected Points for this gameweek. |
| `ep_next` | `Float` | Expected Points for next gameweek. |
| `minutes` | `Int` | Total minutes played. |
| `goals_scored` | `Int` | Total goals scored. |
| `assists` | `Int` | Total assists. |
| `clean_sheets` | `Int` | Total clean sheets. |
| `goals_conceded` | `Int` | Total goals conceded. |
| `own_goals` | `Int` | Total own goals. |
| `penalties_saved` | `Int` | Total penalties saved. |
| `penalties_missed` | `Int` | Total penalties missed. |
| `yellow_cards` | `Int` | Total yellow cards. |
| `red_cards` | `Int` | Total red cards. |
| `saves` | `Int` | Total saves (GKP). |
| `bonus` | `Int` | Total bonus points. |
| `bps` | `Int` | Total Bonus Points System score. |
| `influence` | `Float` | ICT Index: Influence score. |
| `creativity` | `Float` | ICT Index: Creativity score. |
| `threat` | `Float` | ICT Index: Threat score. |
| `ict_index` | `Float` | Overall ICT Index. |
| `expected_goals` (xG) | `Float` | Expected Goals data (Opta). |
| `expected_assists` (xA) | `Float` | Expected Assists data (Opta). |
| `expected_goal_involvements` (xGI) | `Float` | xG + xA. |
| `expected_goals_conceded` (xGC) | `Float` | Expected Goals Conceded. |
| `transfers_in` | `Int` | Total transfers in this season. |
| `transfers_out` | `Int` | Total transfers out this season. |
| `transfers_in_event` | `Int` | Transfers in during current gameweek. |
| `transfers_out_event` | `Int` | Transfers out during current gameweek. |
| `dreamteam_count` | `Int` | Number of times in TotW. |
| `in_dreamteam` | `Boolean` | Is currently in Dream Team of the Week. |
| `chance_of_playing_next_round` | `Int` | Percentage (0, 25, 50, 75, 100). |
| `chance_of_playing_this_round` | `Int` | Percentage (0, 25, 50, 75, 100). |

## Advanced & Edge Case Queries

### 1. Finding "Differentials"
Players with low ownership (< 5%) but high form (> 5.0).
```graphql
query {
  elements(
    where: { 
      selected_by_percent: { lt: 5.0 },
      form: { gt: 5.0 }
    }
    orderBy: { direction: DESC, field: form }
    first: 10
  ) {
    items {
      web_name
      selected_by_percent
      form
      total_points
    }
  }
}
```

### 2. The "Underperformers" (High xG but Low Goals)
Players usually about to score. High Expected Goals but low actual Goals Scored.
```graphql
query {
  elements(
    where: { 
       expected_goals: { gt: 4.0 }, 
       goals_scored: { lt: 2 } 
    }
  ) {
    items {
      web_name
      expected_goals
      goals_scored
      team { short_name }
    }
  }
}
```

### 3. Price Risers (Bandwagon)
Players being transferred in heavily this week.
```graphql
query {
  elements(
    orderBy: { direction: DESC, field: transfers_in_event }
    first: 5
  ) {
    items {
      web_name
      transfers_in_event
      cost_change_event
      status
    }
  }
}
```

### 4. Bargain Defenders
Defenders (Type 2) under £4.5m with high clean sheets.
```graphql
query {
  elements(
    where: { 
      element_type: { eq: 2 },
      now_cost: { lt: 4.5 },
      clean_sheets: { gt: 2 }
    }
    orderBy: { direction: DESC, field: total_points }
  ) {
    items {
      web_name
      now_cost
      clean_sheets
      total_points
    }
  }
}
```
