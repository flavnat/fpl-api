// src/modules/fixtures/fixtures.resolver.ts
import { and, eq, sql } from 'drizzle-orm'
import { fixtures, syncState } from '../../db/schema.js'
import { buildOrderBy, buildWhereConditions } from '../../utils/query-builder.js'

const fixtureColumns = {
  id: fixtures.id,
  code: fixtures.code,
  event: fixtures.event,
  team_h: fixtures.team_h,
  team_a: fixtures.team_a,
  team_h_score: fixtures.team_h_score,
  team_a_score: fixtures.team_a_score,
  finished: fixtures.finished,
  finished_provisional: fixtures.finished_provisional,
  started: fixtures.started,
  team_h_difficulty: fixtures.team_h_difficulty,
  team_a_difficulty: fixtures.team_a_difficulty,
  kickoff_time: fixtures.kickoff_time,
}

export const fixturesResolver = {
  Query: {
    fixtures: async (_: any, { where, orderBy, first, limit, offset, event }: any, { db }: any) => {
      const limitVal = first || limit || 50
      const offsetVal = offset || 0

      // Build WHERE conditions from filter
      let whereCondition = buildWhereConditions(where, fixtureColumns)
      
      // Support legacy 'event' parameter for backwards compatibility
      if (event) {
        const eventCondition = eq(fixtures.event, event)
        whereCondition = whereCondition ? and(whereCondition, eventCondition) : eventCondition
      }

      // Base count query
      let countQuery = db.select({ count: sql`count(*)` }).from(fixtures)
      if (whereCondition) {
        countQuery = countQuery.where(whereCondition)
      }
      const [countResult] = await countQuery
      const total = Number(countResult.count)

      // Get sync state
      const [syncResult] = await db
        .select({ syncedAt: syncState.syncedAt })
        .from(syncState)
        .where(eq(syncState.key, 'fixtures'))

      // Build main query
      let query = db.select().from(fixtures)
      
      if (whereCondition) {
        query = query.where(whereCondition)
      }

      // Apply ordering
      const orderClause = buildOrderBy(orderBy, fixtureColumns, fixtures.kickoff_time, 'ASC')
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

    fixture: async (_: any, { id }: { id: number }, { db }: any) => {
      const [result] = await db.select().from(fixtures).where(eq(fixtures.id, id))
      return result
    },
  },
  Fixture: {
    team_h: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.team_h.load(parent)
    },
    team_a: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.team_a.load(parent)
    },
    stats: (parent: any, _args: any, { loader }: any) => {
      return loader.Fixture.stats.load(parent)
    },
  },
  StatValue: {
    element: (parent: any, _args: any, { loader }: any) => {
      return loader.StatValue.element.load(parent)
    },
  },
}
