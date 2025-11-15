import { fetchProfileFromSession, fetchProfileStatus, fetchUserFiles } from '@util/profileActions';
import Link from 'next/link';
import Checkout from '@components/Payment/Checkout';
import { ArtistStepper } from '@components/User/ArtistStepper';
import React from 'react';
import { Stack } from '@mui/material';
import process from 'node:process';
import { fetchTransactions } from '@util/transActions';
import UserTransactionView from '@components/User/UserTransactionView';
import ApplicationPreview from '@components/User/ApplicationPreview';
import ApplicationsClosedInfo from '@components/Info/ApplicationsClosedInfo';

export const metadata = {
  title: 'Artist Checkout',
};

const stripePublishableKey = `${process.env.TEST_MODE === 'false'
  ? process.env.STRIPE_PUBLISHABLE_KEY_LIVE
  : process.env.STRIPE_PUBLISHABLE_KEY_TEST}`;

// TODO: setup userID in checkout session
export default async function CheckoutPage() {
  const userProfile = await fetchProfileFromSession();
  const feeAmount = parseInt(`${process.env.NEXT_PUBLIC_REGISTRATION_FEE}`, 10);
  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);
  const transactions = await fetchTransactions(userProfile.id);
  const alreadyPaid = transactions.find((t) => parseInt(`${t.amount}`, 10) === feeAmount) !== undefined;
  const userUploads = await fetchUserFiles(userProfile.id);
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

  // Determine if registrations are closed: cutoff is midnight between the end date and the next day
  const endDateEnv = process.env.NEXT_PUBLIC_REGISTRATION_END_DATE || '';
  let registrationsClosed = false;
  if (endDateEnv) {
    const match = endDateEnv.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      const datePart = match[1];
      // Interpret as local time midnight and add one day to get the cutoff at start of the next day
      const endDayStart = new Date(`${datePart}T00:00:00`);
      const cutoff = new Date(endDayStart.getTime() + 24 * 60 * 60 * 1000);
      registrationsClosed = new Date() > cutoff;
    }
  }

  return (
    <Stack spacing={2}>
      <h1 className="items-center text-[color:var(--gold-color)] italic">Pay Artist Registration Fee</h1>

      <ArtistStepper profileStatus={profileStatus} />

      <ApplicationPreview userProfile={userProfile} userUploads={userUploads} />

      {registrationsClosed ? (
        <ApplicationsClosedInfo />
      ) : (
        <Checkout
          feeType="registration"
          feeText={feeText}
          buttonText="Pay Registration Fee"
          stripePublishableKey={stripePublishableKey}
          disabled={alreadyPaid || !eligibleToRegister}
        />
      )}

      <UserTransactionView
        title={`${USER_LABEL} Transactions`}
        fetchUserTransactions={async (options) => {
          'use server';

          return fetchTransactions(userProfile.id, options);
        }}
      />

      <Link href="/profile">Click here to return to your profile</Link>
    </Stack>
  );
}
