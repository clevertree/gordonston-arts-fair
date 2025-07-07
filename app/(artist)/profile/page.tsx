import { validateSession } from '@util/session';
import { fetchProfileByEmail } from '@util/profileActions';
import { redirect } from 'next/navigation';
import ProfileView from '@components/Profile/ProfileView';
import Link from 'next/link';

export const metadata = {
  title: 'Artist Profile',
};

export default async function ProfilePage() {
  let sessionEmail: string | undefined;
  try {
    const session = await validateSession();
    sessionEmail = session.email;
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }
  const profileData = await fetchProfileByEmail(sessionEmail);

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
