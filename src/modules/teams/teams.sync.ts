import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { syncState, teams } from '../../db/schema.js'

import { db } from '../../plugins/db.js'

const UPSERT_COLUMNS = [
  'code',
  'draw',
  'form',
  'loss',
  'name',
  'played',
  'points',
  'position',
  'short_name',
  'strength',
  'team_division',
  'unavailable',
  'win',
  'strength_overall_home',
  'strength_overall_away',
  'strength_attack_home',
  'strength_attack_away',
  'strength_defence_home',
  'strength_defence_away',
  'pulse_id',
] as const

type UpsertColumn = (typeof UPSERT_COLUMNS)[number]

export async function syncTeams() {
  try {
    const { body } = await request(FPL_API.BOOTSTRAP_STATIC)
    const data: any = await body.json()

    const teamsToSync = data.teams.map((t: any) => ({
      id: t.id,
      code: t.code,
      draw: t.draw,
      form: t.form,
      loss: t.loss,
      name: t.name,
      played: t.played,
      points: t.points,
      position: t.position,
      short_name: t.short_name,
      strength: t.strength,
      team_division: t.team_division,
      unavailable: t.unavailable,
      win: t.win,
      strength_overall_home: t.strength_overall_home,
      strength_overall_away: t.strength_overall_away,
      strength_attack_home: t.strength_attack_home,
      strength_attack_away: t.strength_attack_away,
      strength_defence_home: t.strength_defence_home,
      strength_defence_away: t.strength_defence_away,
      pulse_id: t.pulse_id,
    }))

    // Pre-fetch existing teams
    const existingTeams = await db.select().from(teams)
    const existingMap = new Map(existingTeams.map(t => [t.id, t]))

    // Filter out unchanged teams
    const teamsToInsert = teamsToSync.filter((t: any) => {
      const existing = existingMap.get(t.id)
      if (!existing)
        return true

      // Check if any upsert column has changed
      return UPSERT_COLUMNS.some((col) => {
        return (existing as any)[col] !== (t as any)[col]
      })
    })

    const upsertSet = Object.fromEntries(
      UPSERT_COLUMNS.map(col => [
        col,
        sql.raw(`excluded.${col}`),
      ]),
    ) as Record<UpsertColumn, any>

    if (teamsToInsert.length > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(teams)
          .values(teamsToInsert)
          .onConflictDoUpdate({
            target: teams.id,
            set: upsertSet,
          })

        await tx.insert(syncState)
          .values({
            key: 'teams',
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
          key: 'teams',
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: syncState.key,
          set: {
            syncedAt: sql`NOW()`,
          },
        })
    }

    return { count: teamsToInsert.length, total: teamsToSync.length }
  }
  catch (error: any) {
    throw new Error(`syncTeams failed: ${error.message}`)
  }
}
