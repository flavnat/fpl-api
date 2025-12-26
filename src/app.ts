import { env } from './config/env.js'
import { createServer } from './server.js'
import { setupGracefulShutdown } from './utils/graceful-shutdown.js'

async function start() {
  try {
    const fastify = await createServer()

    // Setup graceful shutdown
    setupGracefulShutdown(fastify)

    // Start server
    await fastify.listen({
      port: env.PORT,
      host: '0.0.0.0',
    })

    fastify.log.info(`Server listening on port ${env.PORT}`)
    fastify.log.info(`Environment: ${env.NODE_ENV}`)
    fastify.log.info(`GraphQL endpoint: http://localhost:${env.PORT}/graphql`)
    
    if (env.ENABLE_GRAPHIQL) {
      fastify.log.info(`GraphiQL: http://localhost:${env.PORT}/graphiql`)
    }
    
    if (env.ENABLE_SWAGGER) {
      fastify.log.info(`API Documentation: http://localhost:${env.PORT}/documentation`)
    }
  }
  catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
