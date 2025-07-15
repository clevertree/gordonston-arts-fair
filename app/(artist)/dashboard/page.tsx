import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { ArtistStepper } from '@components/User/ArtistStepper';
import ProfileView from '@components/User/ProfileView';
import { Stack } from '@mui/material';
import UserTransactionView from '@components/User/UserTransactionView';
import UserLogView from '@components/User/UserLogView';
import { fetchTransactions } from '@util/transActions';
import { fetchUserLogs } from '@util/logActions';
import { SessionPayload } from '../../../types';

export const metadata = {
  title: 'Artist Dashboard',
};

export default async function ProfilePage() {
  let session: SessionPayload | undefined;
  try {
    session = await validateSession();
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }
  const profileData = await fetchProfileByID(session.userID);
  const transactions = await fetchTransactions(session.userID);
  const logs = await fetchUserLogs(session.userID);
  const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Dashboard</h1>

      <ArtistStepper profileData={profileData} showAlert />

      <ProfileView
        userProfile={profileData}
      />
      <UserTransactionView transactions={transactions} title={`${USER_LABEL} Transactions`} />
      <UserLogView logs={logs} title={`${USER_LABEL} Logs`} />

      <Link href="/profile/edit">Click here to edit your profile</Link>
    </Stack>
  );
}
