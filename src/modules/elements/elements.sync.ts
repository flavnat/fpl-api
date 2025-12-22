import { sql } from 'drizzle-orm'
import { request } from 'undici'
import { elements, syncState } from '../../db/schema.js'
import { db } from '../../plugins/db.js'

const FPL_URL = 'https://fantasy.premierleague.com/api/elements/'

const UPSERT_COLUMNS = [
  'can_transact',
  'can_select',
  'chance_of_playing_next_round',
  'chance_of_playing_this_round',
  'code',
  'cost_change_event',
  'cost_change_event_fall',
  'cost_change_start',
  'cost_change_start_fall',
  'dreamteam_count',
  'element_type',
  'ep_next',
  'ep_this',
  'event_points',
  'first_name',
  'form',
  'in_dreamteam',
  'news',
  'news_added',
  'now_cost',
  'photo',
  'points_per_game',
  'removed',
  'second_name',
  'selected_by_percent',
  'special',
  'squad_number',
  'status',
  'team',
  'team_code',
  'total_points',
  'transfers_in',
  'transfers_in_event',
  'transfers_out',
  'transfers_out_event',
  'value_form',
  'value_season',
  'web_name',
  'region',
  'team_join_date',
  'birth_date',
  'has_temporary_code',
  'opta_code',
  'minutes',
  'goals_scored',
  'assists',
  'clean_sheets',
  'goals_conceded',
  'own_goals',
  'penalties_saved',
  'penalties_missed',
  'yellow_cards',
  'red_cards',
  'saves',
  'bonus',
  'bps',
  'influence',
  'creativity',
  'threat',
  'ict_index',
  'clearances_blocks_interceptions',
  'recoveries',
  'tackles',
  'defensive_contribution',
  'starts',
  'expected_goals',
  'expected_assists',
  'expected_goal_involvements',
  'expected_goals_conceded',
] as const

type UpsertColumn = (typeof UPSERT_COLUMNS)[number]

export async function syncElements() {
  try {
    const { body, statusCode } = await request(FPL_URL, {
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    })

    if (statusCode !== 200) {
      throw new Error(`FPL API returned status ${statusCode}`)
    }

    const rawData = await body.text()
    const data = JSON.parse(rawData)

    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response structure from FPL')
    }

    const elementsToSync = data.map((e: any) => ({
      id: e.id,
      can_transact: e.can_transact,
      can_select: e.can_select,
      chance_of_playing_next_round: e.chance_of_playing_next_round,
      chance_of_playing_this_round: e.chance_of_playing_this_round,
      code: e.code,
      cost_change_event: e.cost_change_event,
      cost_change_event_fall: e.cost_change_event_fall,
      cost_change_start: e.cost_change_start,
      cost_change_start_fall: e.cost_change_start_fall,
      dreamteam_count: e.dreamteam_count,
      element_type: e.element_type,
      ep_next: Number.parseFloat(e.ep_next) || 0,
      ep_this: Number.parseFloat(e.ep_this) || 0,
      event_points: e.event_points,
      first_name: e.first_name,
      form: Number.parseFloat(e.form) || 0,
      in_dreamteam: e.in_dreamteam,
      news: e.news,
      news_added: e.news_added,
      now_cost: e.now_cost,
      photo: e.photo,
      points_per_game: Number.parseFloat(e.points_per_game) || 0,
      removed: e.removed,
      second_name: e.second_name,
      selected_by_percent: Number.parseFloat(e.selected_by_percent) || 0,
      special: e.special,
      squad_number: e.squad_number,
      status: e.status,
      team: e.team,
      team_code: e.team_code,
      total_points: e.total_points,
      transfers_in: e.transfers_in,
      transfers_in_event: e.transfers_in_event,
      transfers_out: e.transfers_out,
      transfers_out_event: e.transfers_out_event,
      value_form: Number.parseFloat(e.value_form) || 0,
      value_season: Number.parseFloat(e.value_season) || 0,
      web_name: e.web_name,
      region: e.region,
      team_join_date: e.team_join_date,
      birth_date: e.birth_date,
      has_temporary_code: e.has_temporary_code,
      opta_code: e.opta_code,
      minutes: e.minutes,
      goals_scored: e.goals_scored,
      assists: e.assists,
      clean_sheets: e.clean_sheets,
      goals_conceded: e.goals_conceded,
      own_goals: e.own_goals,
      penalties_saved: e.penalties_saved,
      penalties_missed: e.penalties_missed,
      yellow_cards: e.yellow_cards,
      red_cards: e.red_cards,
      saves: e.saves,
      bonus: e.bonus,
      bps: e.bps,
      influence: Number.parseFloat(e.influence) || 0,
      creativity: Number.parseFloat(e.creativity) || 0,
      threat: Number.parseFloat(e.threat) || 0,
      ict_index: Number.parseFloat(e.ict_index) || 0,
      starts: e.starts,
      clearances_blocks_interceptions: e.clearances_blocks_interceptions,
      recoveries: e.recoveries,
      tackles: e.tackles,
      defensive_contribution: e.defensive_contribution,
      expected_goals: Number.parseFloat(e.expected_goals) || 0,
      expected_assists: Number.parseFloat(e.expected_assists) || 0,
      expected_goal_involvements: Number.parseFloat(e.expected_goal_involvements) || 0,
      expected_goals_conceded: Number.parseFloat(e.expected_goals_conceded) || 0,
    }))

    const upsertSet = Object.fromEntries(
      UPSERT_COLUMNS.map(col => [col, sql.raw(`excluded.${col}`)]),
    ) as Record<UpsertColumn, any>

    await db.transaction(async (tx) => {
      await tx.insert(elements)
        .values(elementsToSync)
        .onConflictDoUpdate({
          target: elements.id,
          set: upsertSet,
        })

      await tx.insert(syncState)
        .values({ key: 'elements', syncedAt: new Date() })
        .onConflictDoUpdate({
          target: syncState.key,
          set: { syncedAt: sql`NOW()` },
        })
    })

    return { count: elementsToSync.length }
  }
  catch (error: any) {
    console.error(error)
    throw new Error(`syncElements failed: ${error.message}`)
  }
}
