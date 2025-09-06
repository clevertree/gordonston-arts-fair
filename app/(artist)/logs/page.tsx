import Link from 'next/link';
import React from 'react';
import { Stack } from '@mui/material';
import { fetchUserLogs } from '@util/logActions';
import UserLogView from '@components/User/UserLogView';
import { fetchProfileFromSession } from '@util/profileActions';

export const metadata = {
  title: 'Artist Profile',
};

export default async function UserLogs() {
  const userProfile = await fetchProfileFromSession();

  const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Profile</h1>

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
