import { validateAdminSession } from '@util/sessionActions';
import { fetchProfileByID, updateUserStatus } from '@util/profileActions';
import Link from 'next/link';
import UserStatusEditorAdmin from '@components/Admin/UserStatusEditorAdmin';
import ProfileView from '@components/Profile/ProfileView';
import { Stack } from '@mui/material';
import UserLogAdmin from '@components/Admin/UserLogAdmin';
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
  const profile = await fetchProfileByID(userID);
  const userLogs = await fetchUserLogs(profile.id);

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
          userStatus={profile.status}
          updateUserStatus={async (newStatus) => {
            'use server';

            return updateUserStatus(profile.id, newStatus, `${newStatus} set by admin #${adminSession.userID}`);
          }}
        />
        <ProfileView userProfile={profile} />

        {/* <SendEmailAdmin */}
        {/*  userStatus={profile.status} */}
        {/*  userEmail={profile.email} */}
        {/*  sendMail={sendMail} */}
        {/* /> */}

        <UserLogAdmin logs={userLogs} email={profile.email} />

      </Stack>
    </Stack>
  );
}
