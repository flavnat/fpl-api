import type { SQL } from 'drizzle-orm'
import { and, asc, eq, inArray, or } from 'drizzle-orm'
import { elements, events, fixtures, fixtureStats, fixtureStatValues, syncState, teams } from '../../db/schema.js'
import { db } from '../../plugins/db.js'
import { createResponse } from '../../utils/create-response.js'

export interface FixtureSearchParams {
  event_id?: string | number
  team_id?: string | number
  finished?: boolean | string
  limit?: string | number
  offset?: string | number
}

export async function getFixtures(params: any) {
  try {
    const conditions: (SQL | undefined)[] = []

    if (params.event_id)
      conditions.push(eq(fixtures.event, Number(params.event_id)))
    if (params.team_id) {
      const tid = Number(params.team_id)
      conditions.push(or(eq(fixtures.team_h, tid), eq(fixtures.team_a, tid)))
    }
    if (params.finished !== undefined) {
      conditions.push(eq(fixtures.finished, params.finished === 'true' || params.finished === true))
    }

    const limit = Number(params.limit) || 20
    const offset = Number(params.offset) || 0

    const fixtureList = await db
      .select()
      .from(fixtures)
      .where(conditions.length > 0 ? and(...(conditions.filter(Boolean) as SQL[])) : undefined)
      .orderBy(asc(fixtures.kickoff_time))
      .limit(limit)
      .offset(offset)

    if (fixtureList.length === 0)
      return createResponse([], null, { count: 0 })

    const fixtureIds = fixtureList.map(f => f.id)
    const eventIds = [...new Set(fixtureList.map(f => f.event).filter(Boolean) as number[])]

    // 4. Fetch Stats Data
    const rawStats = await db
      .select({
        fixture_id: fixtureStats.fixture_id,
        identifier: fixtureStats.identifier,
        value: fixtureStatValues.value,
        side: fixtureStatValues.side,
        element_id: fixtureStatValues.element,
      })
      .from(fixtureStats)
      .leftJoin(fixtureStatValues, eq(fixtureStats.id, fixtureStatValues.stat))
      .where(inArray(fixtureStats.fixture_id, fixtureIds))

    const involvedPlayerIds = [...new Set(rawStats.map(s => s.element_id).filter(Boolean) as number[])]

    const [allTeams, allEvents, allInvolvedPlayers, syncInfo] = await Promise.all([
      db.select().from(teams),
      eventIds.length > 0 ? db.select().from(events).where(inArray(events.id, eventIds)) : Promise.resolve([]),
      involvedPlayerIds.length > 0 ? db.select().from(elements).where(inArray(elements.id, involvedPlayerIds)) : Promise.resolve([]),
      db.select().from(syncState).where(eq(syncState.key, 'bootstrap_all')).limit(1),
    ])

    const teamMap = Object.fromEntries(allTeams.map(t => [t.id, t]))
    const eventMap = Object.fromEntries(allEvents.map(e => [e.id, e]))
    const elementMap = Object.fromEntries(allInvolvedPlayers.map(e => [e.id, e]))

    const data = fixtureList.map((f) => {
      const matchStats = rawStats.filter(s => s.fixture_id === f.id)
      const uniqueIdentifiers = [...new Set(matchStats.map(s => s.identifier))]

      const statsGrouped = uniqueIdentifiers.map(id => ({
        identifier: id,
        h: matchStats
          .filter(s => s.identifier === id && s.side === 'h' && s.element_id)
          .map(s => ({
            value: s.value,
            element: elementMap[s.element_id!] || { id: s.element_id },
          })),
        a: matchStats
          .filter(s => s.identifier === id && s.side === 'a' && s.element_id)
          .map(s => ({
            value: s.value,
            element: elementMap[s.element_id!] || { id: s.element_id },
          })),
      }))

      return {
        ...f,
        event: f.event ? eventMap[f.event] : null,
        team_h: teamMap[f.team_h] || f.team_h,
        team_a: teamMap[f.team_a] || f.team_a,
        stats: statsGrouped,
      }
    })

    return createResponse(data, null, {
      count: data.length,
      limit,
      offset,
      last_sync: syncInfo[0]?.syncedAt || null,
    })
  }
  catch (error: any) {
    return createResponse(null, error.message)
  }
}
