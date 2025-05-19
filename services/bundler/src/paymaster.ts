// @ts-nocheck
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { db, sponsorships, whitelist } from './db.js';
import { eq, and } from 'drizzle-orm';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { keccak256, toHex } from 'viem';

const DAILY_BUDGET = BigInt(process.env.DAILY_BUDGET_WEI ?? '0');
const RPC_URL = process.env.RPC_URL ?? 'http://localhost:8545';
const PAYMASTER_KEY = process.env.PAYMASTER_KEY ?? '0x00';

const account = privateKeyToAccount(PAYMASTER_KEY as `0x${string}`);
const client = createWalletClient({ transport: http(RPC_URL), account });

// In-memory storage for tests when SKIP_DB is enabled
const inMemoryWhitelist = new Set<string>(['0xDapp']);
const inMemorySpendRecord: Record<string, bigint> = {};

export const paymasterPlugin = fp(async function (app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.post('/sponsor', async (req, reply) => {
    const { user, dapp, amountWei } = req.body as { user: string; dapp: string; amountWei: string };
    const today = new Date().toISOString().slice(0, 10);
    const amount = BigInt(amountWei);

    if (process.env.SKIP_DB) {
      // In-memory logic
      if (!inMemoryWhitelist.has(dapp)) {
        return reply.status(403).send({ error: 'not whitelisted' });
      }
      const key = `${user}:${today}`;
      const spent = inMemorySpendRecord[key] ?? 0n;
      if (spent + amount > DAILY_BUDGET) {
        return reply.status(403).send({ error: 'budget exceeded' });
      }
      inMemorySpendRecord[key] = spent + amount;
    } else {
      // DB-based logic
      const wl = await db.select().from(whitelist).where(eq(whitelist.dapp, dapp));
      if (wl.length === 0) {
        return reply.status(403).send({ error: 'not whitelisted' });
      }
      const rows: Array<{ spent: bigint }> = await db
        .select()
        .from(sponsorships)
        .where(and(eq(sponsorships.user, user), eq(sponsorships.date, today)));
      const spent = rows[0]?.spent ?? 0n;
      if (spent + amount > DAILY_BUDGET) {
        return reply.status(403).send({ error: 'budget exceeded' });
      }
      await db.insert(sponsorships).values({ user, date: today, spent: spent + amount }).onConflictDoUpdate({
        target: [sponsorships.user, sponsorships.date],
        set: { spent: spent + amount },
      });
    }

    const hash = keccak256(toHex(`${user}:${amountWei}:${today}`));
    const signature = await client.signMessage({ message: { raw: hash } });

    return { paymasterAndData: signature };
  });
});
