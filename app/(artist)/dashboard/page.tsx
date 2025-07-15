import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { ArtistStepper } from '@components/Profile/ArtistStepper';
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
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Dashboard</h1>

      <ArtistStepper profileData={profileData} showAlert />

      <Link href="/profile/edit">Click here to edit your profile</Link>
    </>
  );
}
