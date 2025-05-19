// @ts-nocheck
"use client";
import { useState } from "react";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import { useToast } from "../../src/toast";
import { useSmartAccountClient } from "../../src/hooks/useSmartAccountClient";

export default function Onboard() {
  const { register, connect, execute, address, loading } = useSmartAccountClient();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const toast = useToast();

  return (
    <div>
      {!address ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!username.match(/^[a-zA-Z0-9_]{3,}$/)) {
              toast('Invalid username');
              return;
            }
            register(username);
          }}
        >
          <input
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" aria-label="Register">
            {loading ? <LoadingSkeleton /> : 'Register Passkey'}
          </button>
          <button type="button" aria-label="Connect" onClick={() => connect()}>
            Connect
          </button>
        </form>
      ) : (
        <button
          aria-label="Mint NFT"
          onClick={async () => {
            try {
              await execute(
                '0x0000000000000000000000000000000000000000',
                0n,
                '0x'
              );
              setStatus('sent');
            } catch {
              toast('Simulation failed');
              setStatus('error');
            }
          }}
        >
          {loading ? <LoadingSkeleton /> : 'Mint NFT'}
        </button>
      )}
      {status === 'sent' && <p>✅ Minted!</p>}
      {status === 'error' && <p>Error</p>}
    </div>
  );
}
