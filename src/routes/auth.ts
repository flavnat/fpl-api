import type { FastifyInstance } from 'fastify'
import { auth } from '../lib/auth.js'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.all('/api/auth/*', async (request, reply) => {
    const url = new URL(request.url, `http://${request.headers.host}`)

    // Add Origin header for non-browser clients (Postman, curl)
    const headers = new Headers(request.headers as Record<string, string>)
    if (!headers.get('origin')) {
      headers.set('origin', `http://${request.headers.host}`)
    }

    const response = await auth.handler(
      new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD'
          ? JSON.stringify(request.body)
          : undefined,
      }),
    )

    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return reply.send(data)
    }

    const text = await response.text()
    return reply.send(text)
  })
}
