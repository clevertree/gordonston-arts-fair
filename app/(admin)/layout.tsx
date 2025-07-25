import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Link from 'next/link';
import FloatingDiv from '@components/FloatingDiv/FloatingDiv';
import { SuspenseContent } from '@app/suspenseContent';
import PackageJSON from '../../package.json';

export const metadata: Metadata = {
  title: 'Gordonston Art Fair',
  description: 'Created by Ari Asulin',
};

export default function AdminLayout({
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
          <Link href="/user">User list</Link>
          <Link href="/logout">Log out</Link>
        </FloatingDiv>
      </header>
      <article role="main" className="max-w-screen-lg flex flex-col z-[2] m-auto p-4">
        {testMode && <div className="bg-red-800 text-white font-bold text-center p-2">TEST MODE</div>}
        <Suspense fallback={<SuspenseContent />}>
          {children}
        </Suspense>
      </article>
      <footer className="footer-container">
        <div className="p-2 text-center">
          For administration support please email or text Ari Asulin at
          {' '}
          <Link href="mailto:ari@asu.edu">ari@asu.edu</Link>
          {' '}
          or
          {' '}
          <Link href="tel:602-632-6729">602-632-6729</Link>
        </div>
        <div className="p-2 text-center">
          <Link href="http://github.com/clevertree/gordonston-arts-fair/">
            Version:
            {PackageJSON.version}
          </Link>
        </div>
      </footer>
    </>
  );
}
