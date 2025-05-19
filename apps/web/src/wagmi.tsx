import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { ReactNode } from 'react';

export function configureClient() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http('/api/rpc') },
  });
}

export function Wagmi({ children }: { children: ReactNode }) {
  const config = configureClient();
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
