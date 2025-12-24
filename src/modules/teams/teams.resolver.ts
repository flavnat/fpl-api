// src/modules/teams/teams.resolver.ts
import { asc, eq } from 'drizzle-orm'
import { teams } from '../../db/schema.js'

export const teamsResolver = {
  Query: {
    // Direct query: No loader needed here
    teams: async (_: any, __: any, { db }: any) => {
      return await db.select().from(teams).orderBy(asc(teams.name))
    },

    // Single team query
    team: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(teams).where(eq(teams.id, id))
      return result
    },
  },
}
