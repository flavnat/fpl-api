import type { FastifyPluginAsync } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import fastifyPlugin from 'fastify-plugin'
import { env } from '../config/env.js'

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: undefined,
    nameSpace: 'fpl-api-',
    continueExceeding: true,
    skipOnError: true,
    errorResponseBuilder: (_request, context) => ({
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: 'Too many requests, please try again later',
        retryAfter: context.after,
      },
    }),
  })
}

export default fastifyPlugin(rateLimitPlugin, {
  name: 'rate-limit',
  fastify: '5.x',
})
