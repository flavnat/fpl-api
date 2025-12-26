import type { SQLWrapper } from 'drizzle-orm'
import { eq, sql } from 'drizzle-orm'
import { elements, elementTypes, syncState, teams } from '../../db/schema.js'

export const elementsResolver = {
  Query: {
    elements: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 50
      const offsetVal = offset || 0

      const [countResult] = await db.select({ count: sql`count(*)` }).from(elements)
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'elements'))

      const items = await db.select()
        .from(elements)
        .limit(limitVal)
        .offset(offsetVal)

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
