// src/graphql/index.ts
import { buildSchema } from 'drizzle-graphql'
import * as schema from '../db/schema' // Import all your tables
import { db } from '../plugins/db'

const { entities } = buildSchema(db)

export const graphQLConfig = {
  schema: entities,
  graphiql: true,
}
