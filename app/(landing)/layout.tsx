import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DateLocationApply from '@fragments/date-location-apply.mdx';
import { formatDate } from '@util/date';
import FloatingDiv from '@components/FloatingDiv/FloatingDiv';
import Link from 'next/link';
import Image from 'next/image';
import { SuspenseContent } from '@app/suspenseContent';
import { ClerkSessionContent } from '@components/SessionForms/ClerkSessionContent';
import { FooterContent } from '@components/Layout/FooterContent';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Gordonston Art Fair',
  description: 'Created by Ari Asulin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const eventDateString = formatDate(new Date(`${process.env.NEXT_PUBLIC_EVENT_DATE}`));
  return (
    <>
      <header>
        <FloatingDiv className="header-container">
          <Link href="/">Home</Link>
          <Link href="/#gordonston-history">Gordonston</Link>
          <Link href="/#exhibitor-information">Exhibitors</Link>
          <Link href="/#artist-amenities">Amenities</Link>
          <Link href="/#volunteering">Volunteer</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/apply">Artists</Link>
          <ClerkSessionContent />
        </FloatingDiv>
        <div className="relative overflow-hidden">
          <Image
            alt="Hero Image Background: Gates of Gordonston"
            src="/img/PXL_20220613_225011729.MP6_-scaled.jpg"
            fill
            className={styles.heroBackgroundImg}
            priority
          />
          <div className="flex flex-col items-center relative z-10 opacity-95 mx-4 sm:pb-12">
            <div className="pt-8 md:pt-12" />
            <h1 className="text-[color:var(--gold-color-bright)] italic px-3 py-1 rounded-t-3xl bg-[#000A]">Gordonston</h1>
            <h2 className="text-white text-4xl md:text-6xl px-3 py-1 rounded-t-2xl bg-[#000A]">ART FAIR</h2>
            <h3 className="text-white md:text-2xl font-bold px-3 py-1 rounded-3xl bg-[#000A]">{eventDateString}</h3>
            <div className="pt-12 md:pt-12" />
            <DateLocationApply className="bg-white font-bold md:rounded-3xl px-5 py-3" />
          </div>
        </div>
      </header>
      <article role="main" className="max-w-screen-lg flex flex-col z-[2] m-auto p-4">
        <Suspense fallback={<SuspenseContent />}>
          {children}
        </Suspense>
      </article>
      <FooterContent showDates />
    </>
  );
}
