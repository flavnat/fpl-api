import type { FastifyInstance } from 'fastify'
import { healthRoutes } from './health.js'
import { syncRoutes } from './sync.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Register health check routes
  await healthRoutes(fastify)

  // Register sync routes
  await syncRoutes(fastify)

  // Root endpoint
  fastify.get('/', async (_request, reply) => {
    return reply.send({
      name: 'FPL API',
      version: '1.0.0',
      description: 'Unofficial Fantasy Premier League API',
      endpoints: {
        graphql: '/graphql',
        graphiql: '/graphiql',
        documentation: '/documentation',
        health: '/health',
        ready: '/health/ready',
      },
    })
  })
}
