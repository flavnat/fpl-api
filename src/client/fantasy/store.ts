import { httpFetch } from "../../utils/http.ts"
import { FANTASY_API } from "../../utils/url.ts"

export async function getEntry(entryId: number) {
  const response = await httpFetch(
    FANTASY_API.ENTRY(entryId),
  )

  return response.json()
}

export async function getEntryHistory(entryId: number) {
  const response = await httpFetch(
    FANTASY_API.ENTRY_HISTORY(entryId),
  )

  return response.json()
}