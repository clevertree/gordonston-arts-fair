import type {Metadata} from "next";
import React, {Suspense} from "react";
import Link from "next/link";
import FloatingDiv from "@components/FloatingDiv/FloatingDiv";
import {SuspenseContent} from "@app/suspenseContent";

export const metadata: Metadata = {
    title: "Gordonston Art Fair",
    description: "Created by Ari Asulin",
};

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <header>
            <FloatingDiv className='flex flex-wrap justify-evenly bg-black color-white gap-x-3 relative p-1'>
                <Link href='/'>Home</Link>
                <Link href='/user'>User list</Link>
                <Link href='/logout'>Log out</Link>
            </FloatingDiv>
        </header>
        <article className='max-w-screen-lg flex flex-col z-[2] m-auto p-4'>
            <Suspense fallback={<SuspenseContent/>}>
                {children}
            </Suspense>
        </article>
        <footer
            className='w-full text-[color:var(--foreground-inverted-color)] bg-[color:var(--background-inverted-color)] m-auto'>
            <div className='p-4 pb-6 text-center'>
                For administration support please email or text Ari Asulin at{' '}
                <Link href='mailto:ari@asu.edu'>ari@asu.edu</Link> or {' '}
                <Link href='tel:602-632-6729'>602-632-6729</Link>
            </div>
        </footer>
    </>;
}
