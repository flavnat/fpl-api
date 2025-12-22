import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { elementTypes, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

const FPL_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'

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
    const { body } = await request(FPL_URL)
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

    const upsertSet = Object.fromEntries(
      UPSERT_COLUMNS.map(col => [
        col,
        sql.raw(`excluded.${col}`),
      ]),
    ) as Record<UpsertColumn, any>

    await db.transaction(async (tx) => {
      await tx.insert(elementTypes)
        .values(typesToSync)
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

    return { count: typesToSync.length }
  }
  catch (error: any) {
    throw new Error(`syncElementTypes failed: ${error.message}`)
  }
}
