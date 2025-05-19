// @ts-nocheck
import Fastify from 'fastify';
import { paymasterPlugin } from './paymaster.js';
import { rpcPlugin } from './rpc.js';
import { metricsPlugin } from './metrics.js';

export async function createServer() {
  const app = Fastify({ logger: true });

  try {
    const { default: cors } = await import('@fastify/cors');
    await app.register(cors, { origin: '*' });
  } catch {
    app.log.warn('CORS plugin disabled');
    app.addHook('preHandler', async (_req, reply) => {
      reply.header('access-control-allow-origin', '*');
      reply.header('access-control-allow-headers', '*');
      reply.header('access-control-allow-methods', '*');
    });
  }

  await app.register(metricsPlugin);

  await app.register(paymasterPlugin);
  await app.register(rpcPlugin);

  app.get('/', async () => ({ status: 'ok' }));
  app.get('/healthz', async () => {
    app.log.info('health OK');
    return { ok: true };
  });

  app.ready(() => {
    app.log.info('Bundler ready');
  });

  return app;
}
