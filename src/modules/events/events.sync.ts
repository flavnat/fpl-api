import type { InferInsertModel } from 'drizzle-orm'
import { getTableColumns, sql } from 'drizzle-orm'
import { request } from 'undici'
import { events, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

type NewEvent = InferInsertModel<typeof events>

export async function syncEvents() {
  try {
    const URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    const { body } = await request(URL)
    const data: any = await body.json()

    const eventsToSync: NewEvent[] = data.events.map((e: any) => ({
      id: e.id,
      name: e.name,
      deadline_time: e.deadline_time ? new Date(e.deadline_time) : null,
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
      chip_playes: e.chip_plays || [],
      most_selected: e.most_selected,
      most_transferred_in: e.most_transferred_in,
      top_element: e.top_element,
      top_element_info: e.top_element_info,
      transfers_made: e.transfers_made,
      most_captained: e.most_captained,
      most_vice_captained: e.most_vice_captained,
    }))

    const updateSet = Object.fromEntries(
      Object.entries(getTableColumns(events)).map(([propName, column]) => [
        propName,
        sql.raw(`excluded.${column.name}`),
      ]),
    )

    await db.transaction(async (tx) => {
      await tx.insert(events)
        .values(eventsToSync)
        .onConflictDoUpdate({
          target: events.id,
          set: updateSet,
        })

      await tx.insert(syncState)
        .values({ key: 'events', syncedAt: new Date() })
        .onConflictDoUpdate({
          target: syncState.key,
          set: { syncedAt: sql`NOW()` },
        })
    })

    return { count: eventsToSync.length }
  }
  catch (error) {
    throw new Error(`Failed to sync events: ${error}`)
  }
}
