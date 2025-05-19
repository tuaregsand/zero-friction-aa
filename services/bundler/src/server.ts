// @ts-nocheck
import Fastify from 'fastify';
import { paymasterPlugin } from './paymaster.js';
import { rpcPlugin } from './rpc.js';

export async function createServer() {
  const app = Fastify({ logger: true });

  app.addHook('preHandler', async (_req, reply) => {
    reply.header('access-control-allow-origin', '*');
    reply.header('access-control-allow-headers', '*');
    reply.header('access-control-allow-methods', '*');
  });

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
