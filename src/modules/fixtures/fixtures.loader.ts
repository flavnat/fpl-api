import { eq, inArray } from 'drizzle-orm'
import { elements, fixtureStats, fixtureStatValues, teams } from '../../db/schema.js'

export const fixturesLoaders = {
  Fixture: {
    team_h: {
      loader: async (queries: any[], { db }: any) => {
        const ids = [...new Set(queries.map(q => q.obj.team_h).filter(Boolean))]
        const result = await db.select().from(teams).where(inArray(teams.id, ids))
        return queries.map(q => result.find((row: { id: any }) => row.id === q.obj.team_h) || null)
      },
    },
    team_a: {
      loader: async (queries: any[], { db }: any) => {
        const ids = [...new Set(queries.map(q => q.obj.team_a).filter(Boolean))]
        const result = await db.select().from(teams).where(inArray(teams.id, ids))
        return queries.map(q => result.find((row: { id: any }) => row.id === q.obj.team_a) || null)
      },
    },
    stats: {
      loader: async (queries: any[], { db }: any) => {
        const fixtureIds = queries.map(q => q.obj.id)

        const allData = await db
          .select({
            fixtureId: fixtureStats.fixture_id,
            identifier: fixtureStats.identifier,
            value: fixtureStatValues.value,
            elementId: fixtureStatValues.element,
            side: fixtureStatValues.side,
          })
          .from(fixtureStats)
          .leftJoin(fixtureStatValues, eq(fixtureStats.id, fixtureStatValues.stat))
          .where(inArray(fixtureStats.fixture_id, fixtureIds))

        return fixtureIds.map((fId) => {
          const fixtureRows = allData.filter((r: { fixtureId: any }) => r.fixtureId === fId)

          const uniqueIdents = [...new Set(fixtureRows.map((r: { identifier: any }) => r.identifier))]

          return uniqueIdents.map(ident => ({
            identifier: ident,
            h: fixtureRows.filter((r: { identifier: unknown, side: string }) => r.identifier === ident && r.side === 'h')
              .map((r: { value: any, elementId: any }) => ({ value: r.value, elementId: r.elementId })),
            a: fixtureRows.filter((r: { identifier: unknown, side: string }) => r.identifier === ident && r.side === 'a')
              .map((r: { value: any, elementId: any }) => ({ value: r.value, elementId: r.elementId })),
          }))
        })
      },
    },
  },

  StatValue: {
    element: {
      loader: async (queries: any[], { db }: any) => {
        const ids = queries.map(q => q.obj.elementId).filter(Boolean)
        const result = await db.select().from(elements).where(inArray(elements.id, ids))
        return queries.map(q => result.find((r: { id: any }) => r.id === q.obj.elementId) || null)
      },
    },
  },
}
