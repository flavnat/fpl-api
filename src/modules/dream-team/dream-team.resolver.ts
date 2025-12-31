import { eq } from 'drizzle-orm'
import { dreamTeam } from '../../db/schema.js'

export const dreamTeamResolver = {
  Query: {
    dreamTeam: async (_: any, { event_id }: { event_id: number }, { db }: any) => {
      const [result] = await db.select().from(dreamTeam).where(eq(dreamTeam.event_id, event_id))
      return result || null
    },
  },
  DreamTeam: {
    top_element: (parent: any, _args: any, { loader }: any) => {
      return loader.DreamTeam.top_element.load(parent)
    },
  },
  DreamTeamPlayer: {
    element: (parent: any, _args: any, { loader }: any) => {
      return loader.DreamTeamPlayer.element.load(parent)
    },
  },
}
