import type { SQL } from 'drizzle-orm'
import { and, asc, desc, eq, gte, ilike, lte } from 'drizzle-orm'
import { elements, elementTypes, syncState, teams } from '../../db/schema.js'
import { db } from '../../plugins/db.js'
import { createResponse } from '../../utils/create-response.js'

export interface ElementSearchParams {
  name?: string
  team_id?: string | number
  element_type?: string | number
  min_points?: string | number
  min_cost?: string | number
  max_cost?: string | number
  sort?: 'total_points' | 'now_cost' | 'form' | 'ict_index' | 'goals_scored' | 'assists' | 'minutes'
  order?: 'asc' | 'desc'
  limit?: string | number
  offset?: string | number
}

export async function getElements(params: ElementSearchParams) {
  try {
    const conditions: (SQL | undefined)[] = []

    if (params.name)
      conditions.push(ilike(elements.web_name, `%${params.name}%`))

    if (params.team_id)
      conditions.push(eq(elements.team, Number(params.team_id)))

    if (params.element_type)
      conditions.push(eq(elements.element_type, Number(params.element_type)))

    if (params.min_points)
      conditions.push(gte(elements.total_points, Number(params.min_points)))

    if (params.min_cost)
      conditions.push(gte(elements.now_cost, Number(params.min_cost)))

    if (params.max_cost)
      conditions.push(lte(elements.now_cost, Number(params.max_cost)))

    const sortMap = {
      total_points: elements.total_points,
      now_cost: elements.now_cost,
      form: elements.form,
      ict_index: elements.ict_index,
      goals_scored: elements.goals_scored,
      assists: elements.assists,
      minutes: elements.minutes,
    } as const

    const sortOrder = params.order === 'desc' ? desc : asc
    const sortKey = params.sort as keyof typeof sortMap
    const orderByColumn = sortMap[sortKey] || elements.total_points

    const limit = Number(params.limit) || 20
    const offset = Number(params.offset) || 0

    const result = await db
      .select({
        elements,
        elementTypes,
        teams,
      })
      .from(elements)
      .leftJoin(teams, eq(elements.team, teams.id))
      .leftJoin(elementTypes, eq(elements.element_type, elementTypes.id))
      .where(conditions.length > 0 ? and(...(conditions.filter(Boolean) as SQL[])) : undefined)
      .orderBy(sortOrder(orderByColumn))
      .limit(limit)
      .offset(offset)

    const syncInfo = await db
      .select()
      .from(syncState)
      .where(eq(syncState.key, 'elements'))
      .limit(1)

    const formattedData = result.map((row: any) => ({
      ...row.elements,
      team: row.teams,
      element_type: row.elementTypes,
    }))
    return createResponse(formattedData, null, {
      limit,
      offset,
      count: result.length,
      last_synced: syncInfo[0]?.syncedAt || null,
    })
  }
  catch (error: any) {
    return createResponse(null, error.message)
  }
}
