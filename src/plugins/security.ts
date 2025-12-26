import type { FastifyPluginAsync } from 'fastify'
import helmet from '@fastify/helmet'
import fastifyPlugin from 'fastify-plugin'
import { env } from '../config/env.js'

const securityPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(helmet, {
    // Allow GraphiQL in development
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
    global: true,
  })
}

export default fastifyPlugin(securityPlugin, {
  name: 'security',
  fastify: '5.x',
})
