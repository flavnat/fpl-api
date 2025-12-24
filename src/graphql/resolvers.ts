import { eq } from 'drizzle-orm'
import { elementTypes, teams } from '../db/schema.js'
import { db } from '../plugins/db.js'

export const resolvers = {
  Query: {
    teams: async () => {
      return await db.select().from(teams)
    },
    team: async (_: any, { id }: { id: number }) => {
      const result = await db.select().from(teams).where(eq(teams.id, id))
      return result[0]
    },
    elementTypes: async () => {
      return await db.select().from(elementTypes)
    },
  },
}
