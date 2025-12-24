import { inArray } from 'drizzle-orm'
import { elements } from '../../db/schema.js'

function createElementsLoader(columnName: string) {
  return async (queries: any[], { db }: any) => {
    // 1. Extract IDs from the specific column on the Event object
    const ids = [...new Set(queries.map(q => q.obj[columnName]).filter(Boolean))]

    if (ids.length === 0) {
      return queries.map(() => null)
    }

    const result = await db
      .select()
      .from(elements)
      .where(inArray(elements.id, ids))

    return queries.map(q =>
      result.find((r: any) => r.id === q.obj[columnName]) || null,
    )
  }
}

export const eventsLoaders = {
  Event: {
    most_selected: { loader: createElementsLoader('most_selected') },
    most_transferred_in: { loader: createElementsLoader('most_transferred_in') },
    top_element: { loader: createElementsLoader('top_element') },
    most_captained: { loader: createElementsLoader('most_captained') },
    most_vice_captained: { loader: createElementsLoader('most_vice_captained') },

    chip_playes: {
      loader: async (queries: any[]) => {
        return queries.map(q => q.obj.chip_playes || [])
      },
    },
  },
}
