'use client';

// Error boundaries must be client components

import React from 'react';
import {SignedIn, SignedOut, SignInButton, UserButton,} from '@clerk/nextjs';
import {Button, Stack, Typography} from '@mui/material';
import {MdError} from 'react-icons/md';
import Link from 'next/link';
import {useRouter} from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div>

      <Stack spacing={4}
             className="flex flex-col items-center justify-center h-screen"
      >
        <MdError size={100} color="red" style={{ margin: '0 auto' }} />
        <Typography component="h2" align="center">
          Error:
          {' '}
          {error.message}
          . Please contact the
          {' '}
          <Link href={`mailto:admin@gordonstonartfair.com?subject=${error.message}`}>admin</Link>
          {' '}
          for assistance.
        </Typography>
        <SignedOut>
          <SignInButton forceRedirectUrl="/redirect">
            <Button variant="contained">
              Click here to sign in
            </Button>
          </SignInButton>
          {/* <SignUpButton> */}
          {/*  <Button variant="contained"> */}
          {/*    Click here to register */}
          {/*  </Button> */}
          {/* </SignUpButton> */}
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Button
          variant="contained"
          onClick={() => {
            router.refresh();
            reset();
          }}
        >
          Refresh the page
        </Button>
      </Stack>
    </div>
  );
}
