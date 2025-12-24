// src/modules/elements/elements.loaders.ts
import { inArray } from 'drizzle-orm'
import { elementTypes, teams } from '../../db/schema.js'

export const elementsLoaders = {
  // 1. This must match the TYPE name in your GraphQL schema
  Element: {
    // 2. These must match the FIELD names inside that type
    team: {
      loader: async (queries: any[], { db }: any) => {
        // Mercurius 'queries' is an array of objects: { obj, params }
        // We extract the team IDs from the 'obj' (the Element)
        const ids = queries.map(q => q.obj.team).filter(Boolean)

        if (ids.length === 0)
          return queries.map(() => null)

        const result = await db.select().from(teams).where(inArray(teams.id, ids))

        // Map back to the order of queries
        return queries.map(q => result.find((row: { id: any }) => row.id === q.obj.team) || null)
      },
      opts: { cache: true },
    },
    element_type: {
      loader: async (queries: any[], { db }: any) => {
        const ids = queries.map(q => q.obj.element_type).filter(Boolean)

        if (ids.length === 0)
          return queries.map(() => null)

        const result = await db.select().from(elementTypes).where(inArray(elementTypes.id, ids))

        return queries.map(q => result.find((row: { id: any }) => row.id === q.obj.element_type) || null)
      },
    },
  },
}
