import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { healthRoutes } from './routes/health.route.ts';

export function App() {
    const app = Fastify({ logger: true , ajv: {customOptions: {coerceTypes: false, allErrors: true}}}).withTypeProvider<TypeBoxTypeProvider>();

    app.addHook('onRequest', async (request) => {
        request.log.info(`${request.method} ${request.url}`)
    })
;
    app.register(healthRoutes);
    return app;
}

