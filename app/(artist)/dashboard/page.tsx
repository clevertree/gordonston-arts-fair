import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { ArtistStepper } from '@components/Profile/ArtistStepper';
import ProfileView from '@components/Profile/ProfileView';
import { Stack } from '@mui/material';
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

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Dashboard</h1>

      <ArtistStepper profileData={profileData} showAlert />

      <ProfileView
        userProfile={profileData}
      />

      <Link href="/profile/edit">Click here to edit your profile</Link>
    </Stack>
  );
}
