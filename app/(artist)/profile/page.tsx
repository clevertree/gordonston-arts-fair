import ProfileEditor from '@components/Profile/ProfileEditor';
import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfileAndUploads, updateProfile, uploadFile
} from '@util/profileActions';
import { redirect } from 'next/navigation';
import { UserTableRow } from '@util/schema';

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
  const profileData = await fetchProfileAndUploads(sessionEmail);

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Profile</h1>

      <ProfileEditor
        userProfile={profileData}
        uploadFile={async (file: File) => {
          'use server';

          await uploadFile(sessionEmail, file);
          return fetchProfileAndUploads(sessionEmail);
        }}
        deleteFile={async (filename: string) => {
          'use server';

          return deleteFile(sessionEmail, filename);
        }}
        updateProfile={async (newUserProfile: UserTableRow) => {
          'use server';

          return updateProfile(sessionEmail, newUserProfile);
        }}
      />
    </>
  );
}
