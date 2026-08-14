import { httpFetch } from "../../utils/http.ts"
import { FANTASY_API } from "../../utils/url.ts"

export async function getBootstrapStatic() {
  const response = await httpFetch(FANTASY_API.BOOTSTRAP_STATIC)
  return response.json()
}

export async function getFixtures() {
  const response = await httpFetch(FANTASY_API.FIXTURES)

  return response.json()
}

export async function getElementSummary(elementId: number) {
  const response = await httpFetch(
    FANTASY_API.ELEMENT_SUMMARY(elementId),
  )
  return response.json()
}