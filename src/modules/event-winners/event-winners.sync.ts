import { eq, sql } from 'drizzle-orm'
import { request } from 'undici'
import { FPL_API } from '../../config/fpl-api.js'
import { eventWinners, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch event winners from FPL API',
  SYNC_FAILED: 'Failed to sync event winners',
} as const

/**
 * Sync event winners for all events (1-38)
 * Uses the official FPL event winners endpoint
 * Skips events that return 404 (not yet finished)
 * Optimized: Only syncs events that don't have data yet
 */
export async function syncEventWinners() {
  const results = {
    synced: [] as number[],
    skipped: [] as number[],
    cached: [] as number[],
    errors: [] as { eventId: number, error: string }[],
  }

  try {
    console.log('Starting sync for event winners (events 1-38)...')

    // Pre-fetch all existing event winners grouped by event_id
    const existingWinners = await db
      .select({
        event_id: eventWinners.event_id,
        count: sql<number>`count(*)::int`,
      })
      .from(eventWinners)
      .groupBy(eventWinners.event_id)

    const existingEventsMap = new Map(
      existingWinners.map(w => [w.event_id, w.count])
    )

    console.log(`Found ${existingEventsMap.size} events with existing data`)

    // Iterate through all possible events
    for (let eventId = 1; eventId <= 38; eventId++) {
      try {
        // Skip if this event already has winners data (winners are immutable)
        if (existingEventsMap.has(eventId)) {
          const count = existingEventsMap.get(eventId)!
          console.log(`Event ${eventId} already has ${count} winners, skipping...`)
          results.cached.push(eventId)
          continue
        }

        console.log(`Syncing event ${eventId}...`)

        // Fetch event winners from FPL API
        const { body, statusCode } = await request(FPL_API.EVENT_WINNERS(eventId), {
          headers: {
            'user-agent': 'Mozilla/5.0',
          },
        })

        // Skip if event not found (404) - likely not yet finished
        if (statusCode === 404) {
          console.log(`Event ${eventId} not found (likely not yet finished), skipping...`)
          results.skipped.push(eventId)
          continue
        }

        if (statusCode !== 200) {
          console.warn(`Event ${eventId} returned status ${statusCode}, skipping...`)
          results.skipped.push(eventId)
          continue
        }

        const rawData = await body.text()
        const data = JSON.parse(rawData)

        // Check if API returned "Not found" or error
        if (data.detail === 'Not found.' || data.detail) {
          console.log(`Event ${eventId} not available: ${data.detail}, skipping...`)
          results.skipped.push(eventId)
          continue
        }

        // The API returns an array directly
        const winners = Array.isArray(data) ? data : []

        if (winners.length === 0) {
          console.log(`Event ${eventId} has no winners, skipping...`)
          results.skipped.push(eventId)
          continue
        }

        // Map winners - the API already returns the exact format we need!
        const eventWinnersData = winners.map((entry: any) => ({
          event_id: eventId,
          rank: entry.rank,
          rank_sort: entry.rank_sort,
          team_name: entry.team_name,
          entry_id: entry.entry_id,
          points: entry.points,
          entry_url: entry.entry_url,
          team_url: entry.team_url,
          first_name: entry.first_name,
          last_name: entry.last_name,
        }))

        // Insert new winners (no need to delete since we already checked they don't exist)
        if (eventWinnersData.length > 0) {
          await db.insert(eventWinners).values(eventWinnersData)
        }

        // Update sync state for this event
        await db
          .insert(syncState)
          .values({
            key: `event_winners_${eventId}`,
            syncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: syncState.key,
            set: { syncedAt: new Date() },
          })

        console.log(`✓ Synced ${eventWinnersData.length} winners for event ${eventId}`)
        results.synced.push(eventId)
      } catch (error: any) {
        console.error(`Error syncing event ${eventId}:`, error.message)
        results.errors.push({ eventId, error: error.message })
        // Continue with next event
        continue
      }
    }

    console.log('\n=== Sync Summary ===')
    console.log(`Synced: ${results.synced.length} events - [${results.synced.join(', ')}]`)
    console.log(`Cached: ${results.cached.length} events - [${results.cached.join(', ')}]`)
    console.log(`Skipped: ${results.skipped.length} events - [${results.skipped.join(', ')}]`)
    console.log(`Errors: ${results.errors.length} events`)

    return {
      count: results.synced.length,
      total: 38,
      synced: results.synced,
      cached: results.cached,
      skipped: results.skipped,
      errors: results.errors,
    }
  } catch (error: any) {
    console.error(ERROR_MESSAGES.SYNC_FAILED, error)
    throw new Error(`${ERROR_MESSAGES.SYNC_FAILED}: ${error.message}`)
  }
}



