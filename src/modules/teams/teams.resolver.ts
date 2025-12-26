// src/modules/teams/teams.resolver.ts
import { asc, eq, sql } from 'drizzle-orm'
import { syncState, teams } from '../../db/schema.js'

export const teamsResolver = {
  Query: {
    teams: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 20
      const offsetVal = offset || 0

      const [countResult] = await db.select({ count: sql`count(*)` }).from(teams)
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'teams'))

      const items = await db.select()
        .from(teams)
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(teams.name))

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
