import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env.js'
import { AuthenticationError } from '../utils/errors.js'

export async function apiKeyAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  const apiKey = request.headers['x-api-key'] as string

  if (!apiKey) {
    throw new AuthenticationError('API key is required')
  }

  if (apiKey !== env.API_KEY) {
    throw new AuthenticationError('Invalid API key')
  }
}
