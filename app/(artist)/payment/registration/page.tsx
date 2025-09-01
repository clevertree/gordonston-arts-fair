import { validateSession } from '@util/session';
import { fetchProfileStatus } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Checkout from '@components/Payment/Checkout';
import { ArtistStepper } from '@components/User/ArtistStepper';
import React from 'react';
import { Stack } from '@mui/material';
import process from 'node:process';
import { fetchTransactions } from '@util/transActions';
import UserTransactionView from '@components/User/UserTransactionView';
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
  const feeAmount = parseInt(`${process.env.NEXT_PUBLIC_REGISTRATION_FEE}`, 10);
  const {
    status: profileStatus
  } = await fetchProfileStatus(session.userID);
  const transactions = await fetchTransactions(session.userID);
  const alreadyPaid = transactions.find((t) => parseInt(`${t.amount}`, 10) === feeAmount) !== undefined;
  const {
    complete: eligibleToRegister,
    message: eligibleToRegisterString
  } = profileStatus;
  let feeText = alreadyPaid
    ? 'You have already paid this fee.'
    : `Please click below to pay the $${feeAmount} registration fee.`;
  if (!eligibleToRegister) {
    feeText = `You have not yet completed your profile. ${eligibleToRegisterString}`;
  }
  const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

  return (
    <Stack spacing={2}>
      <h1 className="items-center text-[color:var(--gold-color)] italic">Pay Artist Registration Fee</h1>

      <ArtistStepper profileStatus={profileStatus} />

      <Checkout
        feeType="registration"
        feeText={feeText}
        buttonText="Pay Registration Fee"
        stripePublishableKey={stripePublishableKey}
        disabled={alreadyPaid || !eligibleToRegister}
      />
      <UserTransactionView transactions={transactions} title={`${USER_LABEL} Transactions`} />
      <Link href="/profile">Click here to return to your profile</Link>
    </Stack>
  );
}
