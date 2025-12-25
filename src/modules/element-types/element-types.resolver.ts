import { asc, eq } from 'drizzle-orm'
import { elementTypes } from '../../db/schema.js'

export const elementTypesResolver = {
  Query: {
    element_types: async (_: any, __: any, { db }: any) => {
      return await db.select().from(elementTypes).orderBy(asc(elementTypes.id))
    },
  },
}
