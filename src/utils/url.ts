/**
 * FPL API Configuration
 * Centralized configuration for all Fantasy Premier League API endpoints
 */

const FANTASY_BASE_URL = 'https://fantasy.premierleague.com/api'
const RESOURCES_BASE_URL = 'https://resources.premierleague.com/premierleague25'

/**
 * FPL API Endpoints
 */
export const FANTASY_API = {
  /**
   * Bootstrap static data endpoint
   * Contains teams, elements, element_types, events, and game settings
   */
  BOOTSTRAP_STATIC: `${FANTASY_BASE_URL}/bootstrap-static/`,

  /**
   * Elements (players) endpoint
   * Contains detailed player data
   */
  ELEMENTS: `${FANTASY_BASE_URL}/elements/`,

  /**
   * Fixtures endpoint
   * Contains match fixtures and results
   */
  FIXTURES: `${FANTASY_BASE_URL}/fixtures/`,

  /**
   * Element summary endpoint
   * @param elementId - The player ID
   */
  ELEMENT_SUMMARY: (elementId: number) => `${FANTASY_BASE_URL}/element-summary/${elementId}/`,

  /**
   * Event live endpoint
   * @param eventId - The gameweek ID
   */
  EVENT_LIVE: (eventId: number) => `${FANTASY_BASE_URL}/event/${eventId}/live/`,

  /**
   * Entry (team) endpoint
   * @param entryId - The team ID
   */
  ENTRY: (entryId: number) => `${FANTASY_BASE_URL}/entry/${entryId}/`,

  /**
   * Entry history endpoint
   * @param entryId - The team ID
   */
  ENTRY_HISTORY: (entryId: number) => `${FANTASY_BASE_URL}/entry/${entryId}/history/`,

  /**
   * Entry event picks endpoint
   * @param entryId - The team ID
   * @param eventId - The gameweek ID
   */
  ENTRY_EVENT_PICKS: (entryId: number, eventId: number) =>
    `${FANTASY_BASE_URL}/entry/${entryId}/event/${eventId}/picks/`,

  /**
   * Leagues classic standings endpoint
   * @param leagueId - The league ID
   */
  LEAGUE_CLASSIC: (leagueId: number) => `${FANTASY_BASE_URL}/leagues-classic/${leagueId}/standings/`,

  /**
   * Event winners endpoint
   * @param eventId - The gameweek ID
   */
  EVENT_WINNERS: (eventId: number) => `${FANTASY_BASE_URL}/winners/event/${eventId}/`,

  /**
   * Dream team endpoint
   * @param eventId - The gameweek ID
   */
  DREAM_TEAM: (eventId: number) => `${FANTASY_BASE_URL}/dream-team/${eventId}/`,
} as const

/**
 * Premier League Resources
 */
export const FANTASY_RESOURCE_API = {
  /**
   * Player photo URL
   * @param photoCode - The player's photo code (usually from element.code or element.photo)
   */
  PLAYER_PHOTO: (photoCode: string) => {
    const nameWithoutExt = photoCode.replace(/\.(jpg|png)$/, '')
    return `${RESOURCES_BASE_URL}/photos/players/110x140/${nameWithoutExt}.png`
  },

  /**
   * Team badge URL
   * @param teamCode - The team code
   */
  TEAM_BADGE: (teamCode: number) =>
    `${RESOURCES_BASE_URL}/badges/t${teamCode}.png`,

  /**
   * Team shirt URL
   * @param shirtCode - The shirt code
   */
  TEAM_SHIRT: (shirtCode: string) =>
    `${RESOURCES_BASE_URL}/photos/shirts/standard/shirt_${shirtCode}.png`,
} as const