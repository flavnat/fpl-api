import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { elementTypes, syncState } from '../../db/schema.js'

import { db } from '../../plugins/db.js'

const UPSERT_COLUMNS = [
  'plural_name',
  'plural_name_short',
  'singular_name',
  'singular_name_short',
  'squad_select',
  'squad_min_select',
  'squad_max_select',
  'squad_min_play',
  'squad_max_play',
  'ui_shirt_specific',
  'sub_positions_locked',
  'element_count',
] as const

type UpsertColumn = (typeof UPSERT_COLUMNS)[number]

export async function syncElementTypes() {
  try {
    const { body } = await request(FPL_API.BOOTSTRAP_STATIC)
    const data: any = await body.json()

    const typesToSync = data.element_types.map((t: any) => ({
      id: t.id,
      plural_name: t.plural_name,
      plural_name_short: t.plural_name_short,
      singular_name: t.singular_name,
      singular_name_short: t.singular_name_short,
      squad_select: t.squad_select,
      squad_min_select: t.squad_min_select,
      squad_max_select: t.squad_max_select,
      squad_min_play: t.squad_min_play,
      squad_max_play: t.squad_max_play,
      ui_shirt_specific: t.ui_shirt_specific,
      sub_positions_locked: t.sub_positions_locked,
      element_count: t.element_count,
    }))

    // Pre-fetch existing element types
    const existingTypes = await db.select().from(elementTypes)
    const existingMap = new Map(existingTypes.map(t => [t.id, t]))

    // Filter out unchanged types
    const typesToInsert = typesToSync.filter((t: any) => {
      const existing = existingMap.get(t.id)
      if (!existing)
        return true

      // Check if any upsert column has changed
      return UPSERT_COLUMNS.some((col) => {
        // Handle json fields comparison if any (sub_positions_locked is array)
        const newVal = (t as any)[col]
        const oldVal = (existing as any)[col]

        if (Array.isArray(newVal) && Array.isArray(oldVal)) {
          // Assuming simple string arrays for sub_positions_locked
          return JSON.stringify(newVal) !== JSON.stringify(oldVal)
        }

        return newVal !== oldVal
      })
    })

    const upsertSet = Object.fromEntries(
      UPSERT_COLUMNS.map(col => [
        col,
        sql.raw(`excluded.${col}`),
      ]),
    ) as Record<UpsertColumn, any>

    if (typesToInsert.length > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(elementTypes)
          .values(typesToInsert)
          .onConflictDoUpdate({
            target: elementTypes.id,
            set: upsertSet,
          })

        await tx.insert(syncState)
          .values({
            key: 'element_types',
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
          key: 'element_types',
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: syncState.key,
          set: {
            syncedAt: sql`NOW()`,
          },
        })
    }

    return { count: typesToInsert.length, total: typesToSync.length }
  }
  catch (error: any) {
    throw new Error(`syncElementTypes failed: ${error.message}`)
  }
}
