// src/modules/teams/teams.resolver.ts
import { eq, sql } from 'drizzle-orm'
import { syncState, teams } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

const teamColumns = {
  id: teams.id,
  name: teams.name,
  short_name: teams.short_name,
  code: teams.code,
  played: teams.played,
  win: teams.win,
  draw: teams.draw,
  loss: teams.loss,
  points: teams.points,
  position: teams.position,
  strength: teams.strength,
  strength_overall_home: teams.strength_overall_home,
  strength_overall_away: teams.strength_overall_away,
  strength_attack_home: teams.strength_attack_home,
  strength_attack_away: teams.strength_attack_away,
  strength_defence_home: teams.strength_defence_home,
  strength_defence_away: teams.strength_defence_away,
}

export const teamsResolver = {
  Query: {
    teams: async (_: any, { where, orderBy, first, limit, offset }: any, { db }: any) => {
      const limitVal = first || limit || 20
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      const whereCondition = buildWhereConditions(where, teamColumns)

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(teams)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get sync state
      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'teams'))

      // Build main query
      let query = db.select().from(teams)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, teamColumns, teams.name, 'ASC')
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

    // Single team query
    team: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(teams).where(eq(teams.id, id))
      return result
    },
  },
}
