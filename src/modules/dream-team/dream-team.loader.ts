import { inArray } from 'drizzle-orm'
import { elements } from '../../db/schema.js'

export const dreamTeamLoaders = {
  DreamTeam: {
    top_element: {
      loader: async (queries: any[], { db }: any) => {
        const ids = queries.map(q => q.obj.top_element_id).filter(Boolean)
        if (ids.length === 0)
          return queries.map(() => null)

        const result = await db.select().from(elements).where(inArray(elements.id, ids))
        return queries.map(q => result.find((rowList: { id: any }) => rowList.id === q.obj.top_element_id) || null)
      },
      opts: { cache: true },
    },
  },
  DreamTeamPlayer: {
    element: {
      loader: async (queries: any[], { db }: any) => {
        const ids = queries.map(q => q.obj.element).filter(Boolean)
        if (ids.length === 0)
          return queries.map(() => null)

        const result = await db.select().from(elements).where(inArray(elements.id, ids))
        return queries.map(q => result.find((row: { id: any }) => row.id === q.obj.element) || null)
      },
      opts: { cache: true },
    },
  },
}
