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
  return (
    <>
      <header>
        <FloatingDiv className="nav-container">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/logout">Log out</Link>
        </FloatingDiv>
      </header>
      <article role="main" className="max-w-screen-lg flex flex-col z-[2] m-auto p-4">
        <Suspense fallback={<SuspenseContent />}>
          {children}
        </Suspense>
      </article>
      <footer
        className="w-full text-[color:var(--foreground-inverted-color)] bg-[color:var(--background-inverted-color)] m-auto"
      >
        <div className="p-4 pb-6 text-center">
          For help submitting your Artist Profile please contact the admin at
          {' '}
          <Link href="mailto:admin@gordonstonartfair.com">admin@gordonstonartfair.com</Link>
        </div>
      </footer>
    </>
  );
}
