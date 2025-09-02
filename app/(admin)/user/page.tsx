import AdminUserList from '@components/Admin/UserListAdmin';
import { Stack } from '@mui/material';

import { validateAdminSession } from '@util/sessionActions';
import { listUsersAsAdmin } from '@util/userActions';

import { UserSearchParams } from '@types';

export const metadata = {
  title: 'Admin User List',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

interface AdminUserListPageProps {
  searchParams: Promise<UserSearchParams>;
}

export default async function AdminUserListPage({ searchParams }:AdminUserListPageProps) {
  await validateAdminSession();
  const userSearchParams = await searchParams;
  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        {`Manage ${USER_LABEL}s`}
      </h1>

      <AdminUserList
        listUsersAsAdmin={async (args) => {
          'use server';

          return listUsersAsAdmin(args);
        }}

      />
    </Stack>
  );
}
