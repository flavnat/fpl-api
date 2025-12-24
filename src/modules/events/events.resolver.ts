import { asc, eq } from 'drizzle-orm'
import { events } from '../../db/schema.js'

export const eventsResolver = {
  Query: {
    events: async (_: any, __: any, { db }: any) => {
      return await db.select().from(events).orderBy(asc(events.id))
    },
    event: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(events).where(eq(events.id, id))
      return result
    },
    currentEvent: async (_: any, __: any, { db }: any) => {
      const [result] = await db.select().from(events).where(eq(events.is_current, true))
      return result || null
    },
  },
  Event: {
    overrides: (parent: any) => ({
      ...parent.overrides,
      rules: JSON.stringify(parent.overrides?.rules),
      scoring: JSON.stringify(parent.overrides?.scoring),
    }),
  },
}
