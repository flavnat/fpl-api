import type { AnyColumn, SQL } from 'drizzle-orm'
import type { ApiResponse } from '../../types/api'

import { and, asc, desc, eq, ilike } from 'drizzle-orm'
import { syncState, teams } from '../../db/schema.js'
import { db } from '../../plugins/db.js'
import { createResponse } from '../../utils/create-response.js'

export interface TeamSearchParams {
  name?: string
  short_name?: string
  sort?: 'id' | 'name' | 'short_name' | 'position' | 'points' | 'strength_overall_home' | 'strength_overall_away' | 'strength_attack_home' | 'strength_attack_away' | 'strength_defence_home' | 'strength_defence_away'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export async function getTeams(params: TeamSearchParams): Promise<ApiResponse> {
  try {
    const conditions: (SQL | undefined)[] = []

    if (params.name) {
      conditions.push(ilike(teams.name, `%${params.name}%`))
    }
    if (params.short_name) {
      conditions.push(eq(teams.short_name, params.short_name.toUpperCase()))
    }

    const sortMap: Record<string, AnyColumn> = {
      id: teams.id,
      name: teams.name,
      short_name: teams.short_name,
      position: teams.position,
      points: teams.points,
      strength_overall_home: teams.strength_overall_home,
      strength_overall_away: teams.strength_overall_away,
      strength_attack_home: teams.strength_attack_home,
      strength_attack_away: teams.strength_attack_away,
      strength_defence_home: teams.strength_defence_home,
      strength_defence_away: teams.strength_defence_away,
    }

    const sortKey = params.sort || 'position'
    const sortOrder = params.order === 'desc' ? desc : asc
    const column = sortMap[sortKey]

    const limit = Number(params.limit) || 20
    const offset = Number(params.offset) || 0

    const syncInfo = await db
      .select()
      .from(syncState)
      .where(eq(syncState.key, 'teams'))
      .limit(1)

    const lastSyncedAt = syncInfo[0]?.syncedAt || null

    const result = await db
      .select()
      .from(teams)
      .where(conditions.length > 0 ? and(...conditions as SQL[]) : undefined)
      .orderBy(column ? sortOrder(column) : asc(teams.position))
      .limit(limit)
      .offset(offset)

    return createResponse(result, null, {
      limit,
      offset,
      last_sync: lastSyncedAt,
    })
  }
  catch (error: any) {
    return createResponse(null, `Failed to fetch teams: ${error.message}`)
  }
}

export async function getTeamById(id: number): Promise<ApiResponse> {
  try {
    const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1)
    const team = result[0] || null

    if (!team) {
      return createResponse(null, `Team with ID ${id} not found`)
    }

    return createResponse(team)
  }
  catch (error: any) {
    return createResponse(null, error.message)
  }
}
