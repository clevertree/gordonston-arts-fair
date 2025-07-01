import AdminUserList from '@components/Admin/UserListAdmin';

import { validateAdminSession } from '@util/sessionActions';
import { listUsersAsAdmin } from '@util/userActions';

export const metadata = {
  title: 'Admin User List',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function PasswordResetValidationPage() {
  await validateAdminSession();
  const userList = await listUsersAsAdmin();
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        {`Manage ${USER_LABEL}s`}
      </h1>

      <AdminUserList userList={userList} />
    </>
  );
}
