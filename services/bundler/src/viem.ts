// @ts-nocheck
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { parseAbi } from 'viem';

export const RPC_URL = process.env.RPC_URL ?? 'http://localhost:8545';
export const ENTRY_POINT = process.env.ENTRY_POINT ?? '0x0000000000000000000000000000000000000000';
export const BUNDLER_KEY = process.env.BUNDLER_KEY ?? '0x00';

export const publicClient = createPublicClient({ transport: http(RPC_URL) });
export const account = privateKeyToAccount(BUNDLER_KEY as `0x${string}`);
export const walletClient = createWalletClient({ transport: http(RPC_URL), account });
export const entryPoint = ENTRY_POINT as `0x${string}`;

export const entryPointAbi = parseAbi([
  'function simulateValidation((address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData,bytes signature) op) returns (uint256)',
]);
