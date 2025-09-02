import { validateAdminSession } from '@util/sessionActions';
import { fetchProfileByID, fetchUserFiles, updateUserStatus } from '@util/profileActions';
import Link from 'next/link';
import UserStatusEditorAdmin from '@components/Admin/UserStatusEditorAdmin';
import ProfileView from '@components/User/ProfileView';
import { Stack } from '@mui/material';
import UserLogView from '@components/User/UserLogView';
import React from 'react';
import { fetchUserLogs } from '@util/logActions';

export const metadata = {
  title: 'Manage an Artist',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function AdminUserManagementPage({
  params,
}: {
  params: Promise<{ userID: number }>
}) {
  const adminSession = await validateAdminSession();

  const { userID } = await params;
  const userProfile = await fetchProfileByID(userID);
  const userUploads = await fetchUserFiles(userProfile.id);

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Manage an Artist</h1>

      <Stack spacing={2} padding={2}>

        <Link
          href="/user"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          {`← Back to ${USER_LABEL} List`}
        </Link>

        <UserStatusEditorAdmin
          userStatus={userProfile.status}
          updateUserStatus={async (newStatus) => {
            'use server';

            return updateUserStatus(userProfile.id, newStatus, `${newStatus} set by admin #${adminSession.userID}`);
          }}
        />
        <ProfileView
          userProfile={userProfile.toJSON()}
          userUploads={userUploads.map((u) => u.toJSON())}
        />

        {/* <SendEmailAdmin */}
        {/*  userStatus={profile.status} */}
        {/*  userEmail={profile.email} */}
        {/*  sendMail={sendMail} */}
        {/* /> */}

        <UserLogView
          title={`${USER_LABEL} Logs`}
          fetchUserLogs={async (args) => {
            'use server';

            return fetchUserLogs(userProfile.id, args);
          }}
        />

      </Stack>
    </Stack>
  );
}
