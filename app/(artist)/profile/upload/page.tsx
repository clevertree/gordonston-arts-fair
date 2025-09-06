import {
  deleteFile, fetchProfileFromSession, fetchProfileStatus, updateFile, uploadFile
} from '@util/profileActions';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import { Stack } from '@mui/material';
import React from 'react';
import { ProfileUploads } from '@components/User/ProfileUploads';

export const metadata = {
  title: 'Upload Artist Images',
};

export default async function ProfileUploadsPage() {
  const userProfile = await fetchProfileFromSession();
  const {
    status: profileStatus,
    uploads: userUploads
  } = await fetchProfileStatus(userProfile);

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Upload Artist Images</h1>

      <ArtistStepper profileStatus={profileStatus} />

      <ProfileUploads
        userUploads={userUploads.map((u) => u.toJSON())}
        updateFile={updateFile}
        uploadFile={uploadFile}
        deleteFile={deleteFile}
      />
      <Link href="/profile/edit">Click here to edit your Artist Profile</Link>
      <Link href="/profile">Click here to return to your profile</Link>
    </Stack>
  );
}
