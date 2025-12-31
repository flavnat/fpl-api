# Sync Process & Algorithm

The FPL API utilizes an intelligent synchronization engine designed to keep your database up-to-date with the official Fantasy Premier League API while minimizing unnecessary database operations and network traffic.

## Overview

The sync process is not a simple "delete and replace". It follows an **Efficiency First** strategy:

1.  **Fetch**: Retrieve the latest data from FPL.
2.  **Compare**: Check against the local database to identify changes.
3.  **Upsert**: Only insert or update records that have actually changed.
4.  **Confirm**: Update the `sync_state` timestamp.

## Optimization Strategy

### 1. Pre-Fetching
Before processing any updates, the system loads the existing relevant dataset into memory (e.g., all Teams or Fixtures). This allows for instant O(1) lookups using a Hash Map, avoiding the need for individual database queries for each record.

### 2. Change Detection
For each record coming from the FPL API, we perform a diff check:

*   **New Records**: If the ID doesn't exist locally -> **INSERT**.
*   **Existing Records**: We compare specific content fields (e.g., `score`, `minutes`, `form`, `price`).
    *   If *any* tracked field differs -> **UPDATE**.
    *   If *no* fields differ -> **SKIP**.

This drastically reduces database writes. For example, during a week with no matches, fetching 1000+ players might result in **0 writes**, protecting your database CPU and I/O.

### 3. Transaction Safety
All updates are wrapped in Database Transactions. This ensures data integrity—either the entire batch syncs successfully, or none of it applies, preventing partial data states.

## Specific Algorithms

### Fixtures (Live Match Data)
The `syncFixtures` process is tuned for live match days:
*   **Trigger**: Fetches from `https://fantasy.premierleague.com/api/fixtures/`
*   **Change Logic**: A fixture is updated if:
    *   It is **Live** (`started` = true AND `finished` = false).
    *   Score changes.
    *   Minutes update.
    *   Bonus points (BPS) are calculated.
*   **Stats Handling**: Match stats (goals, assists, cards) are completely refreshed for any fixture that updates, ensuring the timeline is accurate.

### Elements (Players)
The `syncElements` process handles the heavy lifting of player data:
*   **Trigger**: Fetches from `https://fantasy.premierleague.com/api/bootstrap-static/`
*   **Scope**: Tracks over 50 data points per player including:
    *   Price changes (`now_cost`, `cost_change`).
    *   Status availability (`news`, `chance_of_playing`).
    *   Performance metrics (`form`, `ict_index`, `points`).
*   **Bulk Operations**: Uses high-performance bulk `INSERT ... ON CONFLICT DO UPDATE` statements.

### Teams
The `syncTeams` process is generally static but monitors:
*   **Form & Strength**: Updates team strength ratings (`strength_attack_home`, etc.) which FPL adjusts throughout the season.
*   **Stats**: Wins, draws, losses, and generic table positions.

### Dream Team
The `syncDreamTeam` process fetches the best performing XI for each gameweek:
*   **Trigger**: Iterates through all 38 gameweeks via `/dream-team/{event_id}/`
*   **Data Points**: Top player ID, top player points, and the full 11-player team roster.
*   **Optimization**: Uses upsert to update existing records without duplicates.
*   **Error Handling**: Gracefully skips 404 responses for future gameweeks.

### Event Winners
The `syncEventWinners` process tracks top-performing managers:
*   **Trigger**: Fetches from the global league standings for each gameweek.
*   **Immutability Optimization**: Winners data is immutable once finalized—already synced gameweeks are cached and skipped.
*   **Scope**: Captures rank, points, team name, and manager details for leaderboard entries.
*   **Error Handling**: Skips 404 responses and continues to next event.
