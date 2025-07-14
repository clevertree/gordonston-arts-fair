import ProfileEditor from '@components/Profile/ProfileEditor';
import { validateSession } from '@util/session';
import {
  deleteFile, fetchProfileByID, updateProfile, uploadFile
} from '@util/profileActions';
import { redirect } from 'next/navigation';
import { UserTableRow } from '@util/schema';
import Link from 'next/link';
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
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Edit Artist Profile</h1>

      <ProfileEditor
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
      <Link href="/profile">Click here to return to your dashboard</Link>
    </>
  );
}
