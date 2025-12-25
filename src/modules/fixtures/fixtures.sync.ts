import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { fixtures, fixtureStats, fixtureStatValues, syncState } from '../../db/schema.js'

import { db } from '../../plugins/db.js'

export async function syncFixtures() {
  try {
    const { body } = await request(FPL_API.FIXTURES, {
      headers: { 'user-agent': 'Mozilla/5.0' },
    })
    const data: any = await body.json()

    await db.transaction(async (tx) => {
      for (const f of data) {
        await tx.insert(fixtures)
          .values({
            id: f.id,
            code: f.code,
            event: f.event,
            team_h: f.team_h,
            team_a: f.team_a,
            team_h_score: f.team_h_score,
            team_a_score: f.team_a_score,
            finished: f.finished,
            finished_provisional: f.finished_provisional,
            started: f.started,
            kickoff_time: f.kickoff_time ? new Date(f.kickoff_time) : null,
            minutes: f.minutes,
            provisional_start_time: f.provisional_start_time,
            team_h_difficulty: f.team_h_difficulty,
            team_a_difficulty: f.team_a_difficulty,
            pulse_id: f.pulse_id,
          })
          .onConflictDoUpdate({
            target: fixtures.id,
            set: {
              team_h_score: sql`excluded.team_h_score`,
              team_a_score: sql`excluded.team_a_score`,
              finished: sql`excluded.finished`,
              started: sql`excluded.started`,
              minutes: sql`excluded.minutes`,
            },
          })

        if (f.stats && f.stats.length > 0) {
          for (const s of f.stats) {
            const results = await tx.insert(fixtureStats)
              .values({
                fixture_id: f.id,
                identifier: s.identifier,
              })
              .onConflictDoUpdate({
                target: [fixtureStats.fixture_id, fixtureStats.identifier],
                set: { identifier: sql`excluded.identifier` },
              })
              .returning({ id: fixtureStats.id })
            const insertedStat = results[0]

            if (insertedStat) {
              const statValues = [
                ...s.h.map((v: any) => ({
                  stat: insertedStat.id,
                  element: v.element,
                  value: v.value,
                  side: 'h' as const,
                })),
                ...s.a.map((v: any) => ({
                  stat: insertedStat.id,
                  element: v.element,
                  value: v.value,
                  side: 'a' as const,
                })),
              ]

              if (statValues.length > 0) {
                await tx.delete(fixtureStatValues).where(sql`stat_id = ${insertedStat.id}`)
                await tx.insert(fixtureStatValues).values(statValues)
              }
            }
          }
        }
      }
      await tx.insert(syncState)
        .values({
          key: 'fixtures',
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: syncState.key,
          set: {
            syncedAt: sql`NOW()`,
          },
        })
    })

    return { success: true }
  }
  catch (error: any) {
    console.error('Fixture Sync Failed:', error)
    throw error
  }
}
