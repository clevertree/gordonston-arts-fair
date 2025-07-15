import ProfileEditor from '@components/User/ProfileEditor';
import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfileByID, updateProfile, uploadFile
} from '@util/profileActions';
import { redirect } from 'next/navigation';
import { UserTableRow } from '@util/schema';
import Link from 'next/link';
import { ArtistStepper } from '@components/User/ArtistStepper';
import { Stack } from '@mui/material';
import React from 'react';
import { isProfileComplete } from '@util/profile';
import { SessionPayload } from '../../../../types';

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
  const profileData = await fetchProfileByID(session.userID);

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Edit Artist Profile</h1>

      <ArtistStepper profileData={profileData} />

      <ProfileEditor
        isProfileComplete={isProfileComplete(profileData)}
        userProfile={profileData}
        uploadFile={async (file: File) => {
          'use server';

          await uploadFile(session.userID, file);
          return fetchProfileByID(session.userID);
        }}
        deleteFile={async (filename: string) => {
          'use server';

          return deleteFile(session.userID, filename);
        }}
        updateProfile={async (newUserProfile: UserTableRow) => {
          'use server';

          return updateProfile(session.userID, newUserProfile);
        }}
      />
      <Link href="/dashboard">Click here to return to your dashboard</Link>
    </Stack>
  );
}
