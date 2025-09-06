'use client';

// Error boundaries must be client components

import React, { useEffect } from 'react';
import {
  SignedIn, SignedOut, SignInButton, UserButton,
} from '@clerk/nextjs';
import { Button, Stack, Typography } from '@mui/material';
import { MdError } from 'react-icons/md';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    // if (error instanceof HttpError.Unauthorized) {
    //   router.push('/login');
    // }
    //   if(error.message.includes('Unauthorized')) {
    //       setTimeout(() => {
    //           router.push('/login');
    //       }, 2000)
    //   }
  }, [error]);

  return (
    <div>

      <Stack spacing={4}>
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
          onClick={() => reset()}
        >
          Refresh the page
        </Button>
      </Stack>
    </div>
  );
}
