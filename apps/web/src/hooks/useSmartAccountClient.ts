// @ts-nocheck
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { createPublicClient, http } from 'viem';
import { useCallback, useState } from 'react';

export function useSmartAccountClient() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const client = createPublicClient({ transport: http('/api/rpc') });

  const register = useCallback(async () => {
    try {
      await startRegistration({ publicKey: { challenge: '0', rp: { name: 'zfa' }, user: { id: new Uint8Array([0]), name: 'user', displayName: 'User' } } });
    } catch {}
  }, []);

  const connect = useCallback(async () => {
    try {
      const res = await startAuthentication({ publicKey: { challenge: '0', allowCredentials: [] } });
      setAddress((`0x${res.id}` as `0x${string}`));
    } catch {}
  }, []);

  const execute = useCallback(
    async (to: `0x${string}`, value: bigint, data: `0x${string}`) => {
      await client.call({ to, value, data });
    },
    [client]
  );

  return { address, register, connect, execute };
}
