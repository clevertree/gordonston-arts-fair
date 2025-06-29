import type {Metadata} from "next";
import React, {Suspense} from "react";
import Link from "next/link";
import styles from "./layout.module.css"
import FloatingDiv from "@components/FloatingDiv/FloatingDiv";
import {CircularProgress} from "@mui/material";

export const metadata: Metadata = {
    title: "Gordonston Art Fair",
    description: "Created by Ari Asulin",
};

export default function ArtistLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <header>
            <FloatingDiv className='flex flex-wrap justify-evenly bg-gray-300 text-sm italic gap-x-3 relative p-1 z-10'>
                <Link href='/'>Home</Link>
                <Link href='/register'>Register</Link>
                <Link href='/login'>Log in</Link>
                <Link href='/password'>Reset Password</Link>
            </FloatingDiv>
        </header>
        <article className={styles.article}>

            <Suspense fallback={<CircularProgress/>}>
                {children}
            </Suspense>
        </article>
        <footer>
            <div className='p-4 pb-6'>
                For help submitting your Artist Profile please contact the admin at{' '}
                <Link href='mailto:admin@gordonstonartfair.com'>admin@gordonstonartfair.com</Link>
            </div>
        </footer>
    </>;
}
