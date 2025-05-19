// @ts-nocheck
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useCallback, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

export function useSmartAccountClient() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();
  const wallet = useWalletClient();

  const register = useCallback(async (username: string) => {
    setLoading(true);
    try {
      await startRegistration({
        publicKey: {
          challenge: '0',
          rp: { name: 'zfa' },
          user: { id: new Uint8Array([0]), name: username, displayName: username },
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const res = await startAuthentication({ publicKey: { challenge: '0', allowCredentials: [] } });
      setAddress((`0x${res.id}` as `0x${string}`));
    } finally {
      setLoading(false);
    }
  }, []);

  const execute = useCallback(
    async (to: `0x${string}`, value: bigint, data: `0x${string}`) => {
      setLoading(true);
      try {
        await publicClient?.call({ to, value, data, account: wallet.data?.account });
      } finally {
        setLoading(false);
      }
    },
    [publicClient, wallet]
  );

  return { address, register, connect, execute, loading };
}
