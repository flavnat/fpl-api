import type { FastifyInstance } from 'fastify'
import { apiKeyAuth } from '../middleware/auth.js'

import { syncElementTypes } from '../modules/element-types/element-types.sync.js'
import { syncElements } from '../modules/elements/elements.sync.js'
import { syncEvents } from '../modules/events/events.sync.js'
import { syncFixtures } from '../modules/fixtures/fixtures.sync.js'
import { syncTeams } from '../modules/teams/teams.sync.js'
import { errorResponse, successResponse } from '../utils/api-response.js'

export async function syncRoutes(fastify: FastifyInstance) {
  // Sync all data
  fastify.post(
    '/sync/all',
    {
      schema: {
        description: 'Sync all FPL data',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const [teams, elementTypes, elements, events, fixtures] = await Promise.all([
          syncTeams(),
          syncElementTypes(),
          syncElements(),
          syncEvents(),
          syncFixtures(),
        ])

        return reply.send(
          successResponse(
            {
              elements: elements.count,
              teams: teams.count,
              fixtures: fixtures.count,
              events: events.count,
              elementTypes: elementTypes.count,
            },
            request.id,
            {
              lastSync: {
                elements: new Date().toISOString(),
                teams: new Date().toISOString(),
                fixtures: new Date().toISOString(),
                events: new Date().toISOString(),
                elementTypes: new Date().toISOString(),
              },
            },
          ),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync all failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )

  // Sync elements
  fastify.post(
    '/sync/elements',
    {
      schema: {
        description: 'Sync FPL elements (players)',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const result = await syncElements()
        return reply.send(
          successResponse(result, request.id, {
            lastSync: { elements: new Date().toISOString() },
          }),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync elements failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )

  // Sync teams
  fastify.post(
    '/sync/teams',
    {
      schema: {
        description: 'Sync FPL teams',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const result = await syncTeams()
        return reply.send(
          successResponse(result, request.id, {
            lastSync: { teams: new Date().toISOString() },
          }),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync teams failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )

  // Sync fixtures
  fastify.post(
    '/sync/fixtures',
    {
      schema: {
        description: 'Sync FPL fixtures',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const result = await syncFixtures()
        return reply.send(
          successResponse(result, request.id, {
            lastSync: { fixtures: new Date().toISOString() },
          }),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync fixtures failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )

  // Sync events
  fastify.post(
    '/sync/events',
    {
      schema: {
        description: 'Sync FPL events (gameweeks)',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const result = await syncEvents()
        return reply.send(
          successResponse(result, request.id, {
            lastSync: { events: new Date().toISOString() },
          }),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync events failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )

  // Sync element types
  fastify.post(
    '/sync/element-types',
    {
      schema: {
        description: 'Sync FPL element types (positions)',
        tags: ['sync'],
        security: [{ apiKey: [] }],
      },
      preHandler: [apiKeyAuth],
    },

    async (request, reply) => {
      try {
        const result = await syncElementTypes()
        return reply.send(
          successResponse(result, request.id, {
            lastSync: { elementTypes: new Date().toISOString() },
          }),
        )
      }
      catch (error: any) {
        request.log.error(error, 'Sync element types failed')
        return reply.code(500).send(
          errorResponse('SYNC_ERROR', error.message, undefined, request.id),
        )
      }
    },
  )
}
