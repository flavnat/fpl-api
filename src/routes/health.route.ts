import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import { getBootstrapStatic } from "../client/fantasy/index.ts"

export const healthRoutes:FastifyPluginAsyncTypebox = async (app) => {

    app.get('/ping', async () => {
        return { pong: true }
    })

    app.get('/health',
      async () => {
        const response = await getBootstrapStatic()
        return ({ status: 'ok' , data: response })
    })
}