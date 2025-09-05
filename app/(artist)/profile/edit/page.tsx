import ProfileEditor from '@components/User/ProfileEditor';
import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfileStatus, updateFile, updateProfile
} from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import { Stack } from '@mui/material';
import React from 'react';
import { SessionPayload } from '@types';

export const metadata = {
  title: 'Edit Artist Profile',
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
    user: userProfile
  } = await fetchProfileStatus(userProfile.id);

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Edit Artist Profile</h1>

      <ArtistStepper profileStatus={profileStatus} />

      <ProfileEditor
        profileStatus={profileStatus}
        userProfile={userProfile.toJSON()}
        updateFile={updateFile}
        deleteFile={deleteFile}
        updateProfile={updateProfile}
      />
      <Link href="/profile">Click here to return to your profile</Link>
    </Stack>
  );
}
