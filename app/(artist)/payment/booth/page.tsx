import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Checkout from '@components/Payment/Checkout';
import { ArtistStepper } from '@components/Profile/ArtistStepper';
import React from 'react';
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
  const profileData = await fetchProfileByID(session.userID);
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Pay Artist Registration Fee</h1>

      <ArtistStepper profileData={profileData} />

      <Checkout feeType="booth" stripePublishableKey={stripePublishableKey} />

      <Link href="/dashboard">Click here to return to your dashboard</Link>
    </>
  );
}
