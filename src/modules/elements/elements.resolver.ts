import type { SQLWrapper } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { elements, elementTypes, teams } from '../../db/schema.js'

export const elementsResolver = {
  Query: {
    elements: async (_: any, { limit }: any, { db }: any) => {
      return await db.select().from(elements).limit(limit || 50)
    },
  },
  Element: {
    team: async (parent: { team: number | SQLWrapper }, _args: any, { db }: any) => {
      if (!parent.team)
        return null
      const [result] = await db.select().from(teams).where(eq(teams.id, parent.team))
      return result
    },
    element_type: async (parent: { element_type: any }, _args: any, { db }: any) => {
      if (!parent.element_type)
        return null
      const [result] = await db.select().from(elementTypes).where(eq(elementTypes.id, parent.element_type))
      return result
    },
  },
}
