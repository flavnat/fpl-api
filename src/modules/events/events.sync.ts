import type { InferInsertModel } from 'drizzle-orm'
import { getTableColumns, sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { events, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

type NewEvent = InferInsertModel<typeof events>

export async function syncEvents() {
  try {
    const { body } = await request(FPL_API.BOOTSTRAP_STATIC)
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

    // Pre-fetch existing events
    const existingEvents = await db.select().from(events)
    const existingMap = new Map(existingEvents.map(e => [e.id, e]))

    // Filter out unchanged events
    const eventsToInsert = eventsToSync.filter((e: any) => {
      const existing = existingMap.get(e.id)
      if (!existing)
        return true

      // Compare columns
      const columns = getTableColumns(events)
      return Object.entries(columns).some(([propName, _column]) => {
        const newVal = (e as any)[propName]
        const oldVal = (existing as any)[propName]

        // Simple equality check for primitives
        if (newVal === oldVal)
          return false

        // Fix date comparison
        if (newVal instanceof Date && oldVal instanceof Date) {
          return newVal.getTime() !== oldVal.getTime()
        }

        // Deep compare for objects/arrays (simulated with JSON stringify for now as it's efficient enough for this data size)
        if (typeof newVal === 'object' && newVal !== null && typeof oldVal === 'object' && oldVal !== null) {
          return JSON.stringify(newVal) !== JSON.stringify(oldVal)
        }

        return true
      })
    })

    const updateSet = Object.fromEntries(
      Object.entries(getTableColumns(events)).map(([propName, column]) => [
        propName,
        sql.raw(`excluded.${column.name}`),
      ]),
    )

    if (eventsToInsert.length > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(events)
          .values(eventsToInsert)
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
    }
    else {
      await db.insert(syncState)
        .values({ key: 'events', syncedAt: new Date() })
        .onConflictDoUpdate({
          target: syncState.key,
          set: { syncedAt: sql`NOW()` },
        })
    }

    return { count: eventsToInsert.length, total: eventsToSync.length }
  }
  catch (error) {
    throw new Error(`Failed to sync events: ${error}`)
  }
}
