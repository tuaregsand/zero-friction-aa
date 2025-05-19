// @ts-nocheck
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
process.env.SKIP_DB = '1';
let createServer: any;

let app: Awaited<ReturnType<typeof createServer>>;

beforeAll(async () => {
  process.env.DAILY_BUDGET_WEI = '10';
  createServer = (await import('../src/server.js')).createServer;
  app = await createServer();
});

afterAll(async () => {
  await app.close();
});

describe('paymaster sponsor', () => {
  it.skip('returns signature for whitelisted dapp', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/sponsor',
      payload: { user: '0xUser', dapp: '0xDapp', amountWei: '1' },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).paymasterAndData).toBeDefined();
  });

  it.skip('rejects non-whitelisted dapp', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/sponsor',
      payload: { user: '0xUser', dapp: '0xBad', amountWei: '1' },
    });
    expect(res.statusCode).toBe(403);
  });

  it.skip('rejects when budget exceeded', async () => {
    const res1 = await app.inject({
      method: 'POST',
      url: '/sponsor',
      payload: { user: '0xBudget', dapp: '0xDapp', amountWei: '5' },
    });
    expect(res1.statusCode).toBe(200);
    const res2 = await app.inject({
      method: 'POST',
      url: '/sponsor',
      payload: { user: '0xBudget', dapp: '0xDapp', amountWei: '6' },
    });
    expect(res2.statusCode).toBe(403);
  });
});
