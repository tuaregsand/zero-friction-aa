// @ts-nocheck
"use client";
import { useState } from "react";
import { useSmartAccountClient } from "../../src/hooks/useSmartAccountClient";

export default function Onboard() {
  const { register, connect, execute, address } = useSmartAccountClient();
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div>
      {!address ? (
        <>
          <button onClick={register}>Register Passkey</button>
          <button onClick={connect}>Connect</button>
        </>
      ) : (
        <button
          onClick={async () => {
            try {
              await execute(
                "0x0000000000000000000000000000000000000000",
                0n,
                "0x"
              );
              setStatus("sent");
            } catch {
              setStatus("error");
            }
          }}
        >
          Mint NFT
        </button>
      )}
      {status && <p>{status}</p>}
    </div>
  );
}
