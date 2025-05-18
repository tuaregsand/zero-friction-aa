// @ts-nocheck
import { publicClient, walletClient, entryPoint } from './viem.js';
import type { UserOperation } from './types.js';

const QUEUE: UserOperation[] = [];
let timer: NodeJS.Timeout | undefined;

async function flush() {
  if (QUEUE.length === 0) return;
  const ops = QUEUE.splice(0, QUEUE.length);
  await walletClient.writeContract({
    address: entryPoint,
    abi: [{
      name: 'handleOps',
      type: 'function',
      inputs: [
        { name: 'ops', type: 'tuple[]' },
        { name: 'beneficiary', type: 'address' },
      ],
    }],
    functionName: 'handleOps',
    args: [ops, walletClient.account?.address],
  });
}

export async function addUserOp(op: UserOperation) {
  QUEUE.push(op);
  if (QUEUE.length >= 5) await flush();
  else if (!timer) timer = setTimeout(async () => { await flush(); timer = undefined; }, 2000);
}
