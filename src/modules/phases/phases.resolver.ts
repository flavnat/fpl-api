import { asc, eq, sql } from 'drizzle-orm'
import { phases, syncState } from '../../db/schema.js'

export const phasesResolver = {
  Query: {
    phases: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 50
      const offsetVal = offset || 0

      const [countResult] = await db.select({ count: sql`count(*)` }).from(phases)
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'phases'))

      const items = await db.select()
        .from(phases)
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(phases.id))

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

    phase: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(phases).where(eq(phases.id, id))
      return result
    },
  },
}
