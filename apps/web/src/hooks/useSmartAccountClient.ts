// @ts-nocheck
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useCallback, useState } from 'react';
import { toast } from '../toast.js';
import { usePublicClient, useWalletClient } from 'wagmi';
import { LedgerConnector } from '../ledger.js';

export function useSmartAccountClient() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();
  const wallet = useWalletClient();
  const ledger = typeof navigator !== 'undefined' && (navigator as any).usb ? new LedgerConnector() : null;

  const register = useCallback(async (username: string) => {
    setLoading(true);
    try {
      await startRegistration({
        optionsJSON: {
          challenge: '0',
          rp: { name: 'zfa' },
          user: { id: new Uint8Array([0]), name: username, displayName: username },
        },
      });
    } catch (e: any) {
      toast.error(e.message || 'registration failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const res = await startAuthentication({
        optionsJSON: {
          challenge: '0',
          allowCredentials: [],
        },
      });
      setAddress((`0x${res.id}` as `0x${string}`));
    } catch (e: any) {
      if (ledger) {
        await ledger.connect();
        setAddress('0xLedger');
      } else {
        toast.error(e.message || 'connection failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const execute = useCallback(
    async (to: `0x${string}`, value: bigint, data: `0x${string}`) => {
      setLoading(true);
      try {
        await publicClient?.call({ to, value, data, account: wallet.data?.account });
      } catch (e: any) {
        toast.error(e.message || 'execution failed');
      } finally {
        setLoading(false);
      }
    },
    [publicClient, wallet]
  );

  return { address, register, connect, execute, loading };
}
