// @ts-nocheck
import React from 'react';
import './globals.css';
import Providers from './Providers';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
