// @ts-nocheck
import Fastify from 'fastify';
import { paymasterPlugin } from './paymaster.js';
import { rpcPlugin } from './rpc.js';

export async function createServer() {
  const app = Fastify({ logger: true });

  await app.register(paymasterPlugin);
  await app.register(rpcPlugin);

  app.get('/', async () => ({ status: 'ok' }));

  app.ready(() => {
    app.log.info('Bundler ready');
  });

  return app;
}
