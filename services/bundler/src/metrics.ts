import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';

export const metricsPlugin = fp(async function (app: FastifyInstance) {
  try {
    const { default: metrics } = await import('fastify-metrics');
    await app.register(metrics, { endpoint: '/metrics' });
  } catch (err) {
    app.log.warn('metrics disabled');
  }
});
