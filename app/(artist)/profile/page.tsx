import { validateSession } from '@util/session';
import { fetchProfileByID } from '@util/profileActions';
import { redirect } from 'next/navigation';
import ProfileView from '@components/Profile/ProfileView';
import Link from 'next/link';
import { SessionPayload } from '../../../types';

export const metadata = {
  title: 'Artist Profile',
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

      <ProfileView
        userProfile={profileData}
      />
      <Link href="/profile/edit">Click here to edit your profile</Link>
    </>
  );
}
