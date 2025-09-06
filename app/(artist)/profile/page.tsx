import { fetchProfileFromSession, fetchProfileStatus } from '@util/profileActions';
import ProfileView from '@components/User/ProfileView';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import React from 'react';
import { Stack } from '@mui/material';
import { fetchTransactions } from '@util/transActions';
import { fetchUserLogs } from '@util/logActions';
import UserTransactionView from '@components/User/UserTransactionView';
import UserLogView from '@components/User/UserLogView';

export const metadata = {
  title: 'Artist Profile',
};

export default async function ProfilePage() {
  const userProfile = await fetchProfileFromSession();
  const {
    status: profileStatus,
    uploads: userUploads
  } = await fetchProfileStatus(userProfile);

  const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Profile</h1>

      <ArtistStepper profileStatus={profileStatus} showAlert />

      <Link href="/profile/edit">Click here to edit your profile</Link>
      <ProfileView
        userProfile={userProfile}
        userUploads={userUploads}
      />
      <Link href="/profile/upload">Click here to manage your image uploads</Link>
      <UserTransactionView
        title={`${USER_LABEL} Transactions`}
        fetchUserTransactions={async (options) => {
          'use server';

          return fetchTransactions(userProfile.id, options);
        }}
      />

      <UserLogView
        title={`${USER_LABEL} Logs`}
        fetchUserLogs={async (args) => {
          'use server';

          return fetchUserLogs(userProfile.id, args);
        }}
      />

    </Stack>
  );
}
