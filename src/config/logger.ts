import type { FastifyReply } from "fastify";

export const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
      serializers: {
        res(reply: FastifyReply) {
          return {
            statusCode: reply.statusCode
          }
        }
      }
    },
  },
  production: true,
  test: false,
}