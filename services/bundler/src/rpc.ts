// @ts-nocheck
import { FastifyInstance } from 'fastify';
import { addUserOp } from './aggregator.js';
import { publicClient, entryPointAbi, entryPoint } from './viem.js';
import { decodeFunctionResult, encodeFunctionData } from 'viem';
import type { UserOperation } from './types.js';

export async function rpcPlugin(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const { id, method, params } = req.body as { id: number; method: string; params: any[] };
    try {
      if (method === 'eth_supportedEntryPoints') {
        return { id, jsonrpc: '2.0', result: [entryPoint] };
      }
      if (method === 'eth_estimateUserOperationGas') {
        const op = params[0] as UserOperation;
        const callData = encodeFunctionData({ abi: entryPointAbi, functionName: 'simulateValidation', args: [op] });
        const result = await publicClient.call({ data: callData, to: entryPoint });
        const [gas] = decodeFunctionResult({ abi: entryPointAbi, functionName: 'simulateValidation', data: result.data! });
        return { id, jsonrpc: '2.0', result: { preVerificationGas: gas } };
      }
      if (method === 'eth_sendUserOperation') {
        const op = params[0] as UserOperation;
        await addUserOp(op);
        return { id, jsonrpc: '2.0', result: 'ok' };
      }
      return reply.status(400).send({ id, jsonrpc: '2.0', error: 'method not found' });
    } catch (e: any) {
      return reply.status(500).send({ id, jsonrpc: '2.0', error: e.message });
    }
  });
}
