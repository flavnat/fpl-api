export function toDecimal(value: number): number {
  return Math.round(value) / 10
}

export function getPlayerPhotoUrl(photo?: string): string {
  if (!photo)
    return ''

  const nameWithoutExt = photo.replace(/\.[^/.]+$/, '') // removes any extension
  return `https://resources.premierleague.com/premierleague25/photos/players/110x140/${nameWithoutExt}.png`
}
