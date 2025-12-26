import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { apiKey } from 'better-auth/plugins'
import { env } from '../config/env.js'
import * as schema from '../db/schema.js'

import { db } from '../plugins/db.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    level: 'debug',
  },
  baseURL: env.BETTER_AUTH_URL,
  globalAdvanced: {
    disableCSRFCheck: true,
  },
  plugins: [apiKey()],
})
