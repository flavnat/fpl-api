import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { env } from '../config/env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pool = new Pool({
  connectionString: env.DATABASE_URL_LOCAL,
  // ssl: { rejectUnauthorized: false }
})

const db = drizzle(pool)

async function runMigrations() {
  // eslint-disable-next-line no-console
  console.log('↺ Running migrations...')

  try {
    await migrate(db, {
      migrationsFolder: join(__dirname, '../../drizzle'),
    })
    // eslint-disable-next-line no-console
    console.log('✓ Migrations completed!')
  }
  catch (error) {
    console.error('✗ Migration failed:', error)
    process.exit(1)
  }
  finally {
    await pool.end()
  }
}

runMigrations()
