// @ts-nocheck
import React from 'react';
import './globals.css';
import { ToastProvider } from '../src/toast';
import { Wagmi } from '../src/wagmi';

export const metadata = {
  title: 'Zero-Friction AA',
  description: 'Simple onboarding demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Wagmi>
          <ToastProvider>{children}</ToastProvider>
        </Wagmi>
      </body>
    </html>
  );
}
