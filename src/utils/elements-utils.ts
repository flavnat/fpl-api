import { PL_RESOURCES } from '../config/fpl-api.js'

export function toDecimal(value: number): number {
  return Math.round(value) / 10
}

export function getPlayerPhotoUrl(photo?: string): string {
  if (!photo)
    return ''

  return PL_RESOURCES.PLAYER_PHOTO(photo)
}
