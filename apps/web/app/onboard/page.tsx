// @ts-nocheck
"use client";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import { toast } from "../../src/toast";
import { useSmartAccountClient } from "../../src/hooks/useSmartAccountClient";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Lottie from "lottie-react";
import check from "../check.json";

export default function Onboard() {
  const { register, connect, execute, address, loading } = useSmartAccountClient();
  const [status, setStatus] = useState<string | null>(null);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string }>({ defaultValues: { username: '' } });

  const onSubmit = handleSubmit((data) => {
    register(data.username);
  });

  return (
    <div>
      {!address ? (
        <form onSubmit={onSubmit}>
          <input aria-label="Username" {...formRegister('username', { pattern: /^[a-z0-9]{3,30}$/i })} />
          {errors.username && <p className="text-red-500 text-sm">Invalid username</p>}
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
      {status === 'sent' && <Lottie animationData={check} className="h-12 w-12" />}
      {status === 'error' && <p>Error</p>}
    </div>
  );
}
