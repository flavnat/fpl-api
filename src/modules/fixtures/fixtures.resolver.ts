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
  Fixture: {
    team_h: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.team_h.load(parent)
    },
    team_a: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.team_a.load(parent)
    },
    stats: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.stats.load(parent)
    },
  },
  StatValue: {
    element: (parent: any, _args: any, { loader }: any) => {
      return loader.StatValue.element.load(parent)
    },
  },
}
