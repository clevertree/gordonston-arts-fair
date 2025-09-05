import { validateSession } from '@util/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { Stack } from '@mui/material';
import { fetchUserLogs } from '@util/logActions';
import UserLogView from '@components/User/UserLogView';
import { SessionPayload } from '../../../types';

export const metadata = {
  title: 'Artist Profile',
};

export default async function UserLogs() {
  let session: SessionPayload | undefined;
  try {
    session = await validateSession();
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }

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
