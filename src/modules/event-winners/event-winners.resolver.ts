import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { eventWinners, syncState } from '../../db/schema.js'

export const eventWinnersResolver = {
  Query: {
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
