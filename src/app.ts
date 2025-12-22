import Fastify from 'fastify'
import { env } from './config/env.js'
import { envToLogger } from './config/logger.js'
import db from './plugins/db.js'

const fastify = Fastify({
  logger: envToLogger.development ?? true,
})

fastify.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }
})

async function start() {
  try {
    await fastify.register(db)

    await fastify.listen({ port: Number(env.PORT) || 3000, host: '0.0.0.0' })
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
