// src/modules/fixtures/fixtures.resolver.ts
import { asc, eq } from 'drizzle-orm'
import { fixtures } from '../../db/schema.js'

export const fixturesResolver = {
  Query: {
    fixtures: async (_: any, { event }: { event?: number }, { db }: any) => {
      const query = db.select().from(fixtures)
      if (event) {
        return await query.where(eq(fixtures.event, event)).orderBy(asc(fixtures.kickoff_time))
      }
      return await query.limit(50).orderBy(asc(fixtures.kickoff_time))
    },

    fixture: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(fixtures).where(eq(fixtures.id, id))
      return result
    },
  },
}
