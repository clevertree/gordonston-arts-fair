import type {Metadata} from "next";
import React, {Suspense} from "react";
import styles from "./layout.module.css"
import DateLocationApply from "@fragments/date-location-apply.mdx";
import {formatToLocal} from "@util/date";
import FloatingDiv from "@components/FloatingDiv/FloatingDiv";
import Link from "next/link";
import Image from "next/image";
import {SuspenseContent} from "@app/suspenseContent";

export const metadata: Metadata = {
    title: "Gordonston Art Fair",
    description: "Created by Ari Asulin",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const eventDateString = formatToLocal(new Date(`${process.env.NEXT_PUBLIC_EVENT_DATE}`));
    return <>
        <header>
            <FloatingDiv className='flex flex-wrap justify-evenly bg-black color-white gap-x-3 relative p-1'>
                <Link href='/'>Home</Link>
                <Link href='/#gordonston-history'>Gordonston</Link>
                <Link href='/#exhibitor-information'>Exhibitors</Link>
                <Link href='/#artist-amenities'>Amenities</Link>
                <Link href='/#volunteering'>Volunteer</Link>
                <Link href='/#faq'>FAQ</Link>
            </FloatingDiv>
            <div className='relative'>
                <Image
                    alt="Hero Image Background: Gates of Gordonston"
                    src="/img/PXL_20220613_225011729.MP6_-scaled.jpg"
                    layout='fill'
                    objectFit='cover'
                    className={styles.heroBackgroundImg}/>
                <div className='flex flex-col items-center relative z-10 sm:opacity-90 sm:pb-12'>
                    <div className="pt-8 md:pt-12"/>
                    <h1 className='text-[color:var(--gold-color)] font-bold italic px-3 py-1 rounded-t-3xl bg-[#000A]'>Gordonston</h1>
                    <h2 className='text-white text-4xl md:text-6xl px-3 py-1 rounded-t-2xl bg-[#000A]'>ART FAIR</h2>
                    <h3 className='text-white md:text-2xl font-bold px-3 py-1 rounded-3xl bg-[#000A]'>{eventDateString}</h3>
                    <div className="pt-12 md:pt-12"/>
                    <DateLocationApply className='bg-white'/>
                </div>
            </div>
        </header>
        <article className='max-w-screen-lg flex flex-col z-[2] m-auto p-4'>
            <Suspense fallback={<SuspenseContent/>}>
                {children}
            </Suspense>
        </article>
        <footer
            className='w-full text-[color:var(--foreground-inverted-color)] bg-[color:var(--background-inverted-color)] m-auto'>
            <DateLocationApply/>

            <div className='p-4 pb-6 text-center'>
                This website is managed by <Link href='mailto:ari.asulin@gmail.com'>Ari Asulin</Link>{' '}
                and can be edited via <Link href='https://github.com/clevertree/gordonston-arts-fair'>Github.com</Link>
                <br/>
                For help submitting your Artist Profile please contact the admin at{' '}
                <Link href='mailto:admin@gordonstonartfair.com'>admin@gordonstonartfair.com</Link>
            </div>
        </footer>
    </>;
}

