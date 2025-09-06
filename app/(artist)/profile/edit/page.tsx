import ProfileEditor from '@components/User/ProfileEditor';
import {
  deleteFile, fetchProfileFromSession, fetchProfileStatus, updateFile, updateProfile
} from '@util/profileActions';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import { Stack } from '@mui/material';
import React from 'react';

export const metadata = {
  title: 'Edit Artist Profile',
};

export default async function ProfilePage() {
  const userProfile = await fetchProfileFromSession();
  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);

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
