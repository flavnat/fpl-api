import type { SQL } from 'drizzle-orm'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { elements, events, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'
import { createResponse } from '../../utils/create-response.js'

export interface EventsSearchParams {
  id?: string | number
  finished?: boolean | string
  is_previous?: boolean | string
  is_current?: boolean | string
  is_next?: boolean | string
  sortBy?: 'id' | 'deadline_time'
  order?: 'asc' | 'desc'
  limit?: string | number
  offset?: string | number
}

export async function getEvents(query: any) {
  try {
    const conditions: (SQL | undefined)[] = []

    if (query.finished !== undefined) {
      conditions.push(eq(events.finished, query.finished === 'true' || query.finished === true))
    }
    if (query.is_current !== undefined) {
      conditions.push(eq(events.is_current, query.is_current === 'true' || query.is_current === true))
    }
    if (query.is_next !== undefined) {
      conditions.push(eq(events.is_next, query.is_next === 'true' || query.is_next === true))
    }

    const limit = Number(query.limit) || 40
    const offset = Number(query.offset) || 0
    const sortOrder = query.order === 'desc' ? desc : asc
    const orderBy = query.sortBy === 'id' ? events.id : events.deadline_time

    const eventList = await db
      .select()
      .from(events)
      .where(conditions.length > 0 ? and(...(conditions.filter(Boolean) as SQL[])) : undefined)
      .orderBy(sortOrder(orderBy))
      .limit(limit)
      .offset(offset)

    if (eventList.length === 0)
      return createResponse([], null, { count: 0 })

    const playerIds = new Set<number>()
    eventList.forEach((e) => {
      if (e.most_selected)
        playerIds.add(e.most_selected)
      if (e.most_transferred_in)
        playerIds.add(e.most_transferred_in)
      if (e.top_element)
        playerIds.add(e.top_element)
      if (e.most_captained)
        playerIds.add(e.most_captained)
      if (e.most_vice_captained)
        playerIds.add(e.most_vice_captained)
    })

    const [allPlayers, syncInfo] = await Promise.all([
      playerIds.size > 0
        ? db.select().from(elements).where(inArray(elements.id, Array.from(playerIds)))
        : Promise.resolve([]),
      db.select().from(syncState).where(eq(syncState.key, 'events')).limit(1),
    ])

    const playerMap = Object.fromEntries(allPlayers.map(p => [p.id, p]))

    const data = eventList.map(event => ({
      ...event,
      most_selected: event.most_selected ? playerMap[event.most_selected] : null,
      most_transferred_in: event.most_transferred_in ? playerMap[event.most_transferred_in] : null,
      top_element: event.top_element ? playerMap[event.top_element] : null,
      most_captained: event.most_captained ? playerMap[event.most_captained] : null,
      most_vice_captained: event.most_vice_captained ? playerMap[event.most_vice_captained] : null,
    }))

    return createResponse(data, null, {
      total_records: data.length,
      limit,
      offset,
      last_sync: syncInfo[0]?.syncedAt || null,
    })
  }
  catch (error: any) {
    console.error('Events Service Error:', error)
    return createResponse(null, error.message)
  }
}
