import { asc, desc, eq, sql } from 'drizzle-orm'
import { eventWinners, syncState } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

const eventWinnerColumns = {
  id: eventWinners.id,
  event_id: eventWinners.event_id,
  rank: eventWinners.rank,
  rank_sort: eventWinners.rank_sort,
  points: eventWinners.points,
  team_name: eventWinners.team_name,
  first_name: eventWinners.first_name,
  last_name: eventWinners.last_name,
}

export const eventWinnersResolver = {
  Query: {
    // New unified query matching documentation style: event_winners(where: { event_id: { eq: 10 } }, orderBy: { rank: ASC })
    event_winners: async (_: any, { where, orderBy, first, limit, offset }: any, { db }: any) => {
      const limitVal = first || limit || 50
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      const whereCondition = buildWhereConditions(where, eventWinnerColumns)

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(eventWinners)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get the latest synced event
      const [latestSync] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(sql`${syncState.key} LIKE 'event_winners_%'`)
        .orderBy(desc(syncState.syncedAt))
        .limit(1)

      // Build main query
      let query = db.select().from(eventWinners)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, eventWinnerColumns, eventWinners.rank, 'ASC')
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
          lastSynced: latestSync?.syncedAt?.toISOString() || null,
        },
      }
    },

    // Legacy query for backwards compatibility
    eventWinners: async (_: any, { event_id, limit, offset }: any, { db }: any) => {
      const limitVal = limit || 50
      const offsetVal = offset || 0

      const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(eventWinners)
        .where(eq(eventWinners.event_id, event_id))
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, `event_winners_${event_id}`))

      const items = await db
        .select()
        .from(eventWinners)
        .where(eq(eventWinners.event_id, event_id))
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(eventWinners.rank))

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

    allEventWinners: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 50
      const offsetVal = offset || 0

      const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(eventWinners)
      const total = Number(countResult.count)

      // Get the latest synced event
      const [latestSync] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(sql`${syncState.key} LIKE 'event_winners_%'`)
        .orderBy(desc(syncState.syncedAt))
        .limit(1)

      const items = await db
        .select()
        .from(eventWinners)
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(desc(eventWinners.event_id), asc(eventWinners.rank))

      return {
        items,
        meta: {
          total,
          limit: limitVal,
          offset: offsetVal,
          lastSynced: latestSync?.syncedAt?.toISOString() || null,
        },
      }
    },

    eventWinner: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(eventWinners).where(eq(eventWinners.id, id))
      return result
    },
  },
}
