import type { SQL } from 'drizzle-orm'
import { eq, sql } from 'drizzle-orm'
import { elements, elementTypes, syncState, teams } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

// Column mapping for elements table
const elementColumns = {
  id: elements.id,
  code: elements.code,
  web_name: elements.web_name,
  first_name: elements.first_name,
  second_name: elements.second_name,
  team: elements.team,
  element_type: elements.element_type,
  status: elements.status,
  now_cost: elements.now_cost,
  total_points: elements.total_points,
  event_points: elements.event_points,
  form: elements.form,
  selected_by_percent: elements.selected_by_percent,
  goals_scored: elements.goals_scored,
  assists: elements.assists,
  clean_sheets: elements.clean_sheets,
  minutes: elements.minutes,
  bonus: elements.bonus,
  bps: elements.bps,
  expected_goals: elements.expected_goals,
  expected_assists: elements.expected_assists,
  ict_index: elements.ict_index,
  transfers_in_event: elements.transfers_in_event,
  transfers_out_event: elements.transfers_out_event,
  cost_change_event: elements.cost_change_event,
  in_dreamteam: elements.in_dreamteam,
  chance_of_playing_next_round: elements.chance_of_playing_next_round,
}

export const elementsResolver = {
  Query: {
    elements: async (_: any, { where, orderBy, first, limit, offset }: any, { db }: any) => {
      // Support both 'first' (from docs) and 'limit' for backwards compatibility
      const limitVal = first || limit || 50
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      const whereCondition = buildWhereConditions(where, elementColumns)

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(elements)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get sync state
      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'elements'))

      // Build main query
      let query = db.select().from(elements)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, elementColumns, elements.id, 'ASC')
      if (orderClause) {
        query = query.orderBy(orderClause)
      }

      const items = await query.limit(limitVal).offset(offsetVal)

      return {
        items,
        meta: {
          total,
          limit: limitVal,
          offset: offsetVal,
          lastSynced: syncResult?.syncedAt?.toISOString() || null,
        },
      }
    },
    element: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(elements).where(eq(elements.id, id))
      return result
    },
  },
  Element: {
    team: async (parent: { team: number | SQL }, _args: any, { db }: any) => {
      if (!parent.team)
        return null
      const [result] = await db.select().from(teams).where(eq(teams.id, parent.team))
      return result
    },
    element_type: async (parent: { element_type: any }, _args: any, { db }: any) => {
      if (!parent.element_type)
        return null
      const [result] = await db.select().from(elementTypes).where(eq(elementTypes.id, parent.element_type))
      return result
    },
  },
}
