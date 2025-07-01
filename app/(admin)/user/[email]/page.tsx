import { fetchUserLogs, fetchUserResult } from '@util/userActions';
import { validateAdminSession } from '@util/sessionActions';
import { updateUserStatus } from '@util/profileActions';
import AdminUserPanel from '@components/Admin/AdminUserPanel';

// export const metadata = {
//     title: 'Manage an Artist',
// }

export default async function AdminUserManagementPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  await validateAdminSession();

  const { email } = await params;
  const emailFormatted = email.replace('%40', '@');
  const { profile, status } = await fetchUserResult(emailFormatted);
  const userLogs = await fetchUserLogs(emailFormatted);

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Manage an Artist</h1>
      <AdminUserPanel
        profile={profile}
        userStatus={status}
        updateUserStatus={async (newStatus) => {
          'use server';

          return updateUserStatus(emailFormatted, newStatus);
        }}
        email={emailFormatted}
        logs={userLogs}
      />
    </>
  );
}
