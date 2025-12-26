import type { FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../plugins/db.js'

export interface GraphQLContext {
  db: typeof db
  request: FastifyRequest
  reply: FastifyReply
}

export function createContext(
  request: FastifyRequest,
  reply: FastifyReply,
): GraphQLContext {
  return {
    db,
    request,
    reply,
  }
}
