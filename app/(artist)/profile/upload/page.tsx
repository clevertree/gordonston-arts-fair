import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfileStatus, updateFile, uploadFile
} from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import { Stack } from '@mui/material';
import React from 'react';
import { SessionPayload } from '@types';
import { ProfileUploads } from '@components/User/ProfileUploads';

export const metadata = {
  title: 'Upload Artist Images',
};

export default async function ProfileUploadsPage() {
  let session: SessionPayload | undefined;
  try {
    session = await validateSession();
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }

  const {
    status: profileStatus,
    uploads: userUploads
  } = await fetchProfileStatus(session.userID);

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
