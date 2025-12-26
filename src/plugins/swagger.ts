import type { FastifyPluginAsync } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastifyPlugin from 'fastify-plugin'
import { env } from '../config/env.js'

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  if (!env.ENABLE_SWAGGER) {
    return
  }

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'FPL API',
        description: 'Unofficial Fantasy Premier League API with GraphQL support',
        version: '1.0.0',
        contact: {
          name: 'flavnat',
          email: 'natnael01ayele@gmail.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'sync', description: 'Data synchronization endpoints' },
        { name: 'graphql', description: 'GraphQL endpoint' },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
          },
        },
      },
    },
  })

  await fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  })
}

export default fastifyPlugin(swaggerPlugin, {
  name: 'swagger',
  fastify: '5.x',
})
