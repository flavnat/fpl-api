import type { FastifyInstance } from 'fastify'
import { desc } from 'drizzle-orm'
import { syncState } from '../db/schema.js'

import { db } from '../plugins/db.js'
import { successResponse } from '../utils/api-response.js'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
      },
    },
    async (request, reply) => {
      try {
        // Check database connectivity
        await db.select().from(syncState).limit(1)

        return reply.send(
          successResponse(
            {
              status: 'healthy',
              timestamp: new Date().toISOString(),
              uptime: process.uptime(),
              database: 'connected',
            },
            request.id,
          ),
        )
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return reply.code(503).send(
          successResponse(
            {
              status: 'unhealthy',
              timestamp: new Date().toISOString(),
              uptime: process.uptime(),
              database: 'disconnected',
            },
            request.id,
          ),
        )
      }
    },
  )

  fastify.get(
    '/health/ready',
    {
      schema: {
        description: 'Readiness check endpoint',
        tags: ['health'],
      },
    },
    async (request, reply) => {
      try {
        // Get last sync times
        const syncStates = await db
          .select()
          .from(syncState)
          .orderBy(desc(syncState.syncedAt))

        const lastSync = syncStates.reduce(
          (acc, state) => {
            acc[state.key] = state.syncedAt?.toISOString() || 'never'
            return acc
          },
          {} as Record<string, string>,
        )

        return reply.send(
          successResponse(
            {
              ready: true,
              lastSync,
            },
            request.id,
          ),
        )
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return reply.code(503).send({
          success: false,
          data: {
            ready: false,
          },
        })
      }
    },
  )


}
