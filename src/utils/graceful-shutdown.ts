import type { FastifyInstance } from 'fastify'

export async function gracefulShutdown(
  server: FastifyInstance,
  signal: string,
) {
  server.log.info(`Received ${signal}, starting graceful shutdown...`)

  try {
    // Stop accepting new connections
    await server.close()
    server.log.info('Server closed successfully')

    // Exit process
    process.exit(0)
  }
  catch (error) {
    server.log.error(error, 'Error during graceful shutdown')
    process.exit(1)
  }
}

export function setupGracefulShutdown(server: FastifyInstance) {
  // Handle SIGTERM (e.g., from Docker, Kubernetes)
  process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'))

  // Handle SIGINT (e.g., Ctrl+C)
  process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'))

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    server.log.error(error, 'Uncaught exception')
    gracefulShutdown(server, 'uncaughtException')
  })

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    server.log.error({ reason, promise }, 'Unhandled promise rejection')
    gracefulShutdown(server, 'unhandledRejection')
  })
}
