import compress from '@fastify/compress'
import cors from '@fastify/cors'
import Fastify from 'fastify'
import mercurius from 'mercurius'
import { env } from './config/env.js'
import { envToLogger } from './config/logger.js'
import { createContext } from './graphql/context.js'
import { loaders } from './graphql/loaders.js'
import { resolvers } from './graphql/resolvers.js'
import { schema } from './graphql/schema.js'
import { apiKeyAuth } from './middleware/auth.js'
import db from './plugins/db.js'
import rateLimitPlugin from './plugins/rate-limit.js'
import securityPlugin from './plugins/security.js'
import swaggerPlugin from './plugins/swagger.js'
import { registerRoutes } from './routes/index.js'
import { errorHandler } from './utils/errors.js'

export async function createServer() {
  const fastify = Fastify({
    logger: envToLogger[env.NODE_ENV] ?? true,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
    disableRequestLogging: false,
    genReqId: () => crypto.randomUUID(),
  })

  // Set error handler
  fastify.setErrorHandler(errorHandler)

  // Register plugins
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  })

  await fastify.register(compress, {
    global: true,
    encodings: ['gzip', 'deflate'],
  })

  await fastify.register(securityPlugin)
  await fastify.register(rateLimitPlugin)
  await fastify.register(swaggerPlugin)
  await fastify.register(db)

  // Protect GraphQL endpoints with API key authentication
  fastify.addHook('preHandler', async (request, reply) => {
    const isGraphQLRoute = request.url.startsWith('/graphql') || request.url.startsWith('/graphiql')
    if (isGraphQLRoute) {
      await apiKeyAuth(request, reply)
    }
  })

  // Register GraphQL
  await fastify.register(mercurius, {
    schema,
    resolvers,
    loaders,
    context: createContext,
    graphiql: env.ENABLE_GRAPHIQL,
    path: '/graphql',

  })

  // Register routes
  await registerRoutes(fastify)

  return fastify
}
