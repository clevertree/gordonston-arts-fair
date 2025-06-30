import ProfileEditor from '@components/Profile/ProfileEditor';
import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfile, updateProfile, uploadFile
} from '@util/profileActions';
import { UserProfile } from '@util/profile';
import { redirect } from 'next/navigation';

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
  const profileData = await fetchProfile(sessionEmail);

  return (
    <>
      <h2 className="m-auto text-[color:var(--gold-color)] italic">Artist Profile</h2>

      <ProfileEditor
        userProfile={profileData}
        uploadFile={async (file: File) => {
          'use server';

          await uploadFile(sessionEmail, file);
          return fetchProfile(sessionEmail);
        }}
        deleteFile={async (filename: string) => {
          'use server';

          return deleteFile(sessionEmail, filename);
        }}
        updateProfile={async (newUserProfile: UserProfile) => {
          'use server';

          return updateProfile(sessionEmail, newUserProfile);
        }}
      />
    </>
  );
}
