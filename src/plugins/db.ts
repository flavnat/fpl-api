import fp from 'fastify-plugin'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema.js'
import { env } from '../config/env.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase<typeof schema>
  }
}

const pool = new Pool({
  connectionString: env.DATABASE_URL_LOCAL,
})

export const db = drizzle(pool, { schema })

export default fp(async (fastify) => {

  fastify.decorate('db', db)

  fastify.addHook('onClose', async () => {
    await pool.end()
  })

  try {
    await db.execute('SELECT 1')
    fastify.log.info("✓ PostgreSQL connected")
  } catch (error: any) {
    fastify.log.error("✗ PostgreSQL connection failed", error)
    process.exit(1)
  }
}, { name: 'db' })
