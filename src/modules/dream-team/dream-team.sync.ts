import type { InferInsertModel } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { dreamTeam, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

type NewDreamTeam = InferInsertModel<typeof dreamTeam>

export async function syncDreamTeam() {
  let syncCount = 0

  try {
    for (let gw = 1; gw <= 38; gw++) {
      const { body, statusCode } = await request(FPL_API.DREAM_TEAM(gw))

      if (statusCode === 404)
        continue

      const data: any = await body.json()

      if (data.detail)
        continue

      const record: NewDreamTeam = {
        event_id: gw,
        top_element_id: data.top_player.id,
        top_element_points: data.top_player.points,
        team: data.team,
      }

      await db.insert(dreamTeam)
        .values(record)
        .onConflictDoUpdate({
          target: dreamTeam.event_id,
          set: {
            top_element_id: record.top_element_id,
            top_element_points: record.top_element_points,
            team: record.team,
          },
        })

      syncCount++
    }

    // Update Sync State
    await db.insert(syncState)
      .values({ key: 'dream_team', syncedAt: new Date() })
      .onConflictDoUpdate({
        target: syncState.key,
        set: { syncedAt: sql`NOW()` },
      })

    return { syncedGameweeks: syncCount }
  }
  catch (error) {
    throw new Error(`Failed to sync dream teams: ${error}`)
  }
}
