import { eq, sql } from 'drizzle-orm'
import { dreamTeam, syncState } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

// Column mapping for dream_team table
const dreamTeamColumns = {
  id: dreamTeam.id,
  event_id: dreamTeam.event_id,
  top_element_points: dreamTeam.top_element_points,
}

export const dreamTeamResolver = {
  Query: {
    // New query matching documentation style: dream_teams(where: { event_id: { eq: 15 } })
    dream_teams: async (_: any, { where, orderBy, first, limit, offset }: any, { db }: any) => {
      const limitVal = first || limit || 50
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      const whereCondition = buildWhereConditions(where, dreamTeamColumns)

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(dreamTeam)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get sync state
      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'dream_team'))

      // Build main query
      let query = db.select().from(dreamTeam)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, dreamTeamColumns, dreamTeam.event_id, 'ASC')
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

    // Legacy query for backwards compatibility
    dreamTeam: async (_: any, { event_id }: { event_id: number }, { db }: any) => {
      const [result] = await db.select().from(dreamTeam).where(eq(dreamTeam.event_id, event_id))
      return result || null
    },
  },
  DreamTeam: {
    top_element: (parent: any, _args: any, { loader }: any) => {
      return loader.DreamTeam.top_element.load(parent)
    },
  },
  DreamTeamPlayer: {
    element: (parent: any, _args: any, { loader }: any) => {
      return loader.DreamTeamPlayer.element.load(parent)
    },
  },
}
