import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { phases, syncState } from '../../db/schema.js'

import { db } from '../../plugins/db.js'

const UPSERT_COLUMNS = [
  'name',
  'start_event',
  'stop_event',
  'highest_score',
] as const

type UpsertColumn = (typeof UPSERT_COLUMNS)[number]

export async function syncPhases() {
  try {
    const { body } = await request(FPL_API.BOOTSTRAP_STATIC)
    const data: any = await body.json()

    const phasesToSync = data.phases.map((p: any) => ({
      id: p.id,
      name: p.name,
      start_event: p.start_event,
      stop_event: p.stop_event,
      highest_score: p.highest_score,
    }))

    // Pre-fetch existing phases
    const existingPhases = await db.select().from(phases)
    const existingMap = new Map(existingPhases.map(p => [p.id, p]))

    // Filter out unchanged phases
    const phasesToInsert = phasesToSync.filter((p: any) => {
      const existing = existingMap.get(p.id)
      if (!existing)
        return true

      // Check if any upsert column has changed
      return UPSERT_COLUMNS.some((col) => {
        return (existing as any)[col] !== (p as any)[col]
      })
    })

    const upsertSet = Object.fromEntries(
      UPSERT_COLUMNS.map(col => [
        col,
        sql.raw(`excluded.${col}`),
      ]),
    ) as Record<UpsertColumn, any>

    if (phasesToInsert.length > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(phases)
          .values(phasesToInsert)
          .onConflictDoUpdate({
            target: phases.id,
            set: upsertSet,
          })

        await tx.insert(syncState)
          .values({
            key: 'phases',
            syncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: syncState.key,
            set: {
              syncedAt: sql`NOW()`,
            },
          })
      })
    }
    else {
      await db.insert(syncState)
        .values({
          key: 'phases',
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: syncState.key,
          set: {
            syncedAt: sql`NOW()`,
          },
        })
    }

    return { count: phasesToInsert.length, total: phasesToSync.length }
  }
  catch (error: any) {
    throw new Error(`syncPhases failed: ${error.message}`)
  }
}
