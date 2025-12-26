import { asc, eq, sql } from 'drizzle-orm'
import { elementTypes, syncState } from '../../db/schema.js'

export const elementTypesResolver = {
  Query: {
    element_types: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 100
      const offsetVal = offset || 0

      const [countResult] = await db.select({ count: sql`count(*)` }).from(elementTypes)
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'element_types'))

      const items = await db.select()
        .from(elementTypes)
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(elementTypes.id))

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
}
