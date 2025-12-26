// src/modules/fixtures/fixtures.resolver.ts
import { asc, eq, sql } from 'drizzle-orm'
import { fixtures, syncState } from '../../db/schema.js'

export const fixturesResolver = {
  Query: {
    fixtures: async (_: any, { limit, offset, event }: any, { db }: any) => {
      const limitVal = limit || 50
      const offsetVal = offset || 0

      let countQuery = db.select({ count: sql`count(*)` }).from(fixtures)
      let query = db.select().from(fixtures)

      if (event) {
        countQuery = countQuery.where(eq(fixtures.event, event))
        query = query.where(eq(fixtures.event, event))
      }

      const [countResult] = await countQuery
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'fixtures'))

      const items = await query
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(fixtures.kickoff_time))

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

    fixture: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(fixtures).where(eq(fixtures.id, id))
      return result
    },
  },
}
