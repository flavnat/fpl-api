import z from 'zod'
import 'dotenv/config'

export const env = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Auth
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  API_KEY: z.string().default('your-secret-api-key-change-in-production'),

  // Database
  DATABASE_URL_LOCAL: z.string().optional(),
  DATABASE_URL_DEV: z.string().optional(),
  DATABASE_URL_PROD: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('15 minutes'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // Features
  ENABLE_GRAPHIQL: z.coerce.boolean().default(true),
  ENABLE_SWAGGER: z.coerce.boolean().default(true),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
}).parse(process.env)
