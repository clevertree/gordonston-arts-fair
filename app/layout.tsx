import type { Metadata } from 'next';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import './globals.scss';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeRegistry from '@components/Theme/ThemeRegistry';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Gordonston Art Fair',
  description: 'Created by Ari Asulin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>

  );
}
