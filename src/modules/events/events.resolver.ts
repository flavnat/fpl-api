import { asc, eq, sql } from 'drizzle-orm'
import { events, syncState } from '../../db/schema.js'

export const eventsResolver = {
  Query: {
    events: async (_: any, { limit, offset }: any, { db }: any) => {
      const limitVal = limit || 40
      const offsetVal = offset || 0

      const [countResult] = await db.select({ count: sql`count(*)` }).from(events)
      const total = Number(countResult.count)

      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'events'))

      const items = await db.select()
        .from(events)
        .limit(limitVal)
        .offset(offsetVal)
        .orderBy(asc(events.id))

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
    most_selected: (parent: any, _args: any, { loader }: any) => {
      return loader.Event.most_selected.load(parent)
    },
    most_transferred_in: (parent: any, _args: any, { loader }: any) => {
      return loader.Event.most_transferred_in.load(parent)
    },
    top_element: (parent: any, _args: any, { loader }: any) => {
      return loader.Event.top_element.load(parent)
    },
    most_captained: (parent: any, _args: any, { loader }: any) => {
      return loader.Event.most_captained.load(parent)
    },
    most_vice_captained: (parent: any, _args: any, { loader }: any) => {
      return loader.Event.most_vice_captained.load(parent)
    },
  },
}
