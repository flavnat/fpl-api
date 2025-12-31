import { eq, sql } from 'drizzle-orm'
import { events, syncState } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

// Column mapping for events table
const eventColumns = {
  id: events.id,
  name: events.name,
  finished: events.finished,
  is_current: events.is_current,
  is_next: events.is_next,
  is_previous: events.is_previous,
  average_entry_score: events.average_entry_score,
  highest_score: events.highest_score,
  deadline_time: events.deadline_time,
}

export const eventsResolver = {
  Query: {
    events: async (_: any, { where, orderBy, first, limit, offset }: any, { db }: any) => {
      const limitVal = first || limit || 40
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      const whereCondition = buildWhereConditions(where, eventColumns)

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(events)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get sync state
      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'events'))

      let query = db.select().from(events)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, eventColumns, events.id, 'ASC')
      if (orderClause) {
        query = query.orderBy(orderClause)
      }

      const items = await query.limit(limitVal).offset(offsetVal)

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
