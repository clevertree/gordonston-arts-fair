'use server';

import { UserProfile, UserProfileStatus } from '@util/profile';
import { LogEntry } from '@util/userActions';
import { Alert, Stack } from '@mui/material';
import Link from 'next/link';
import UserStatusEditorAdmin from '@components/Admin/UserStatusEditorAdmin';
import ProfileView from '@components/Profile/ProfileView';
import SendEmailAdmin from '@components/Admin/SendEmailAdmin';
import { sendMail } from '@util/emailActions';
import UserLogAdmin from '@components/Admin/UserLogAdmin';
import React from 'react';

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

interface AdminUserPanelProps {
  profile?: UserProfile,
  userStatus: UserProfileStatus,
  updateUserStatus: (newStatus: UserProfileStatus) => Promise<{ message: string }>,
  email: string,
  logs: LogEntry[]

}

export default async function AdminUserPanel(props: AdminUserPanelProps) {
  // const [logs, setLogs] = useState(props.logs);
  const {
    profile, updateUserStatus, email, logs, userStatus
  } = props;
  return (
    <Stack spacing={2} padding={2}>

      <Link
        href="/user"
        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        {`← Back to ${USER_LABEL} List`}
      </Link>

      {profile
        ? (
          <>
            <UserStatusEditorAdmin
              userStatus={userStatus}
              updateUserStatus={updateUserStatus}
            />
            <ProfileView userProfile={profile} userStatus={userStatus} />
          </>
        )
        : (
          <Alert severity="error">
            {USER_LABEL}
            {' '}
            profile not found for
            {' '}
            {email}
          </Alert>
        )}

      <SendEmailAdmin
        userStatus={userStatus}
        userEmail={email}
        sendMail={sendMail}
      />

      <UserLogAdmin logs={logs} email={email} />

    </Stack>
  );
}
