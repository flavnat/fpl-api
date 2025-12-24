import { getTableColumns, sql } from 'drizzle-orm'
import { request } from 'undici'
import { elements, elementTypes, events, syncState, teams } from '../db/schema.js'
import { db } from '../plugins/db.js'

const FPL_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'

export async function syncAllBootstrapData() {
  try {
    const { body } = await request(FPL_URL, {
      headers: { 'user-agent': 'Mozilla/5.0' },
    })
    const data: any = await body.json()

    await db.transaction(async (tx) => {
      // 1. Sync Teams
      await tx.insert(teams).values(data.teams).onConflictDoUpdate({
        target: teams.id,
        set: Object.fromEntries(Object.keys(data.teams[0]).map(k => [k, sql.raw(`excluded.${k}`)])),
      })

      // 2. Sync Element Types (Positions)
      await tx.insert(elementTypes).values(data.element_types).onConflictDoUpdate({
        target: elementTypes.id,
        set: Object.fromEntries(Object.keys(data.element_types[0]).map(k => [k, sql.raw(`excluded.${k}`)])),
      })

      // 3. Sync Elements (Players)
      await tx.insert(elements).values(data.elements).onConflictDoUpdate({
        target: elements.id,
        set: Object.fromEntries(Object.keys(data.elements[0]).map(k => [k, sql.raw(`excluded.${k}`)])),
      })

      // 4. Sync Events (Gameweeks) - Using your WORKING mapping logic
      const eventsToSync = data.events.map((e: any) => ({
        id: e.id,
        name: e.name,
        deadline_time: e.deadline_time,
        release_time: e.release_time,
        average_entry_score: e.average_entry_score,
        finished: e.finished,
        data_checked: e.data_checked,
        highest_scoring_entry: e.highest_scoring_entry,
        deadline_time_epoch: e.deadline_time_epoch,
        deadline_time_game_offset: e.deadline_time_game_offset,
        highest_score: e.highest_score,
        is_previous: e.is_previous,
        is_current: e.is_current,
        is_next: e.is_next,
        cup_leagues_created: e.cup_leagues_created,
        h2h_ko_matches_created: e.h2h_ko_matches_created,
        can_enter: e.can_enter,
        can_manage: e.can_manage,
        released: e.released,
        ranked_count: e.ranked_count,
        overrides: e.overrides || { rules: {}, scoring: {}, element_types: [], pick_multiplier: null },
        chip_playes: e.chip_plays || [], // Correcting name to match your schema
        most_selected: e.most_selected,
        most_transferred_in: e.most_transferred_in,
        top_element: e.top_element,
        top_element_info: e.top_element_info,
        transfers_made: e.transfers_made,
        most_captained: e.most_captained,
        most_vice_captained: e.most_vice_captained,
      }))

      // Use your reliable updateSet logic
      const eventUpdateSet = Object.fromEntries(
        Object.entries(getTableColumns(events)).map(([propName, column]) => [
          propName,
          sql.raw(`excluded.${column.name}`),
        ]),
      )

      await tx.insert(events)
        .values(eventsToSync)
        .onConflictDoUpdate({
          target: events.id,
          set: eventUpdateSet,
        })

      // 5. Update Sync State
      await tx.insert(syncState)
        .values({ key: 'bootstrap_all', syncedAt: new Date() })
        .onConflictDoUpdate({ target: syncState.key, set: { syncedAt: sql`NOW()` } })
    })

    return { success: true, message: 'Bootstrap data fully synchronized in correct order.' }
  }
  catch (error: any) {
    console.error('Master Sync failed:', error)
    // Log the underlying database error for better debugging
    throw new Error(`Master sync failed: ${error.message}`)
  }
}
