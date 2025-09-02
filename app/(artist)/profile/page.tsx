import { validateSession } from '@util/session';
import { fetchProfileStatus } from '@util/profileActions';
import { redirect } from 'next/navigation';
import ProfileView from '@components/User/ProfileView';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import React from 'react';
import { Stack } from '@mui/material';
import { fetchTransactions } from '@util/transActions';
import { fetchUserLogs } from '@util/logActions';
import UserTransactionView from '@components/User/UserTransactionView';
import UserLogView from '@components/User/UserLogView';
import { SessionPayload } from '../../../types';

export const metadata = {
  title: 'Artist Profile',
};

export default async function ProfilePage() {
  let session: SessionPayload | undefined;
  try {
    session = await validateSession();
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }
  const {
    status: profileStatus,
    user: userProfile,
    uploads: userUploads
  } = await fetchProfileStatus(session.userID);

  const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Profile</h1>

      <ArtistStepper profileStatus={profileStatus} showAlert />

      <ProfileView
        userProfile={userProfile}
        userUploads={userUploads}
      />
      <UserTransactionView
        title={`${USER_LABEL} Transactions`}
        fetchUserTransactions={async (options) => {
          'use server';

          return fetchTransactions(session.userID, options);
        }}
      />

      <UserLogView
        title={`${USER_LABEL} Logs`}
        fetchUserLogs={async (args) => {
          'use server';

          return fetchUserLogs(userProfile.id, args);
        }}
      />

      <Link href="/profile/edit">Click here to edit your profile</Link>
    </Stack>
  );
}
