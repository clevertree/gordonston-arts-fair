import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Checkout from '@components/Payment/Checkout';
import { ArtistStepper } from '@components/User/ArtistStepper';
import React from 'react';
import { Stack } from '@mui/material';
import process from 'node:process';
import { SessionPayload } from '../../../../types';

export const metadata = {
  title: 'Artist Checkout',
};

const stripePublishableKey = `${process.env.TEST_MODE === 'false'
  ? process.env.STRIPE_PUBLISHABLE_KEY_LIVE
  : process.env.STRIPE_PUBLISHABLE_KEY_TEST}`;

// TODO: setup userID in checkout session
export default async function CheckoutPage() {
  let session: SessionPayload | undefined;
  try {
    session = await validateSession();
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }
  const feeAmount = parseInt(`${process.env.NEXT_PUBLIC_BOOTH_FEE}`, 10);
  const profileData = await fetchProfileByID(session.userID);
  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Pay Artist Booth Fee</h1>

      <ArtistStepper profileData={profileData} />

      <Checkout
        feeType="booth"
        feeText={`Please click below to pay the $${feeAmount} booth fee.`}
        buttonText="Pay Booth Fee"
        stripePublishableKey={stripePublishableKey}
      />

      <Link href="/dashboard">Click here to return to your dashboard</Link>
    </Stack>
  );
}
