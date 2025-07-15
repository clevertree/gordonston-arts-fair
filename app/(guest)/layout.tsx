import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Link from 'next/link';
import FloatingDiv from '@components/FloatingDiv/FloatingDiv';
import { SuspenseContent } from '@app/suspenseContent';

export const metadata: Metadata = {
  title: 'Gordonston Art Fair',
  description: 'Created by Ari Asulin',
};

export default function ArtistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const testMode = process.env.TEST_MODE !== 'false';
  return (
    <>
      <header>
        <FloatingDiv className="header-container">
          <Link href="/">Home</Link>
          <Link href="/login">Log in</Link>
        </FloatingDiv>
      </header>
      <article role="main" className="max-w-screen-lg flex flex-col z-[2] m-auto p-4">
        {testMode && <div className="bg-red-500 text-white text-center p-2">TEST MODE</div>}
        <Suspense fallback={<SuspenseContent />}>
          {children}
        </Suspense>
      </article>
      <footer className="footer-container">
        <div className="p-4 pb-6 text-center">
          For help submitting your Artist Profile please contact the admin at
          {' '}
          <Link href="mailto:admin@gordonstonartfair.com">admin@gordonstonartfair.com</Link>
        </div>
      </footer>
    </>
  );
}
