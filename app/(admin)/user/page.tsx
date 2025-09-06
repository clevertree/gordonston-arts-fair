import AdminUserList from '@components/Admin/UserListAdmin';
import { Stack } from '@mui/material';

import { listUsersAsAdmin } from '@util/userActions';

import { validateAdminSession } from '@util/session';

export const metadata = {
  title: 'Admin User List',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function AdminUserListPage() {
  await validateAdminSession();
  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        {`Manage ${USER_LABEL}s`}
      </h1>

      <AdminUserList
        listUsersAsAdmin={listUsersAsAdmin}

      />
    </Stack>
  );
}
