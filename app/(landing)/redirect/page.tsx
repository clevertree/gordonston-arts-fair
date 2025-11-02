'use client';

import React, {useEffect} from 'react';
import {Stack} from '@mui/material';
import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {SuspenseContent} from "@components/Suspense/SuspenseContent";

export default function RedirectPage() {
    const {user} = useUser();
    const router = useRouter();
    const userType = user?.publicMetadata.type as string | undefined;
    useEffect(() => {
        if (userType === 'admin') {
            router.push('/user');
        } else {
            router.push('/profile');
        }
    }, [router, userType]);

    return (
        <Stack spacing={2} className="flex flex-col items-center justify-center h-screen">
            <h1 className="m-auto text-[color:var(--gold-color)] italic">Redirecting...</h1>

            <Link href="/profile">Click here to return to your profile</Link>

            <SuspenseContent/>

        </Stack>
    );
}
