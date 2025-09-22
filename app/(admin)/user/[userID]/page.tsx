import {
  fetchProfileByID, fetchProfileFromSession, fetchUserFiles, updateUserStatus
} from '@util/profileActions';
import Link from 'next/link';
import UserStatusEditorAdmin from '@components/Admin/UserStatusEditorAdmin';
import ProfileView from '@components/User/ProfileView';
import { Stack } from '@mui/material';
import UserLogView from '@components/User/UserLogView';
import React from 'react';
import { fetchUserLogs } from '@util/logActions';
import { validateAdminSession } from '@util/session';
import UserTransactionView from '@components/User/UserTransactionView';
import { fetchTransactions } from '@util/transActions';

export const metadata = {
  title: 'Manage an Artist',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function AdminUserManagementPage({
  params,
}: {
  params: Promise<{ userID: number }>
}) {
  await validateAdminSession();
  const adminProfile = await fetchProfileFromSession();

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
          updateUserStatus={async (newStatus, sendEmailTemplate) => {
            'use server';

            return updateUserStatus(
              userProfile.id,
              newStatus,
              `${newStatus} set by admin #${adminProfile.email}`,
              sendEmailTemplate
            );
          }}
        />
        <ProfileView
          userProfile={userProfile.toJSON()}
          userUploads={userUploads.map((u) => u.toJSON())}
        />

        {/* <SendEmailAdmin */}
        {/*  userStatus={userProfile.status} */}
        {/*  userEmail={userProfile.email} */}
        {/*  sendMail={sendMail} */}
        {/* /> */}

        <UserLogView
          title={`${USER_LABEL} Logs`}
          fetchUserLogs={async (args) => {
            'use server';

            return fetchUserLogs(userProfile.id, args);
          }}
        />
        <UserTransactionView
          title={`${USER_LABEL} Transactions`}
          fetchUserTransactions={async (options) => {
            'use server';

            return fetchTransactions(userProfile.id, options);
          }}
        />
      </Stack>
    </Stack>
  );
}
