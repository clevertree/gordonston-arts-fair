import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import FloatingDiv from '@components/FloatingDiv/FloatingDiv';

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
          <Link href="/profile">Your Artist Profile</Link>
          <Link href="/profile/edit">Edit Profile</Link>
          <Link href="/profile/upload">Upload Images</Link>
          <Link href="/logout">Log out</Link>
        </FloatingDiv>
      </header>
      <article role="main" className="max-w-screen-lg flex flex-col z-[2] m-auto p-4">
        {testMode && <div className="bg-red-800 text-white font-bold text-center p-2">TEST MODE</div>}
        {children}
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
