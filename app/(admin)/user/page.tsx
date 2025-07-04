import AdminUserList from '@components/Admin/UserListAdmin';

import { validateAdminSession } from '@util/sessionActions';
import { listUsersAsAdmin } from '@util/userActions';

export const metadata = {
  title: 'Admin User List',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

interface AdminUserListPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUserListPage({ searchParams }:AdminUserListPageProps) {
  await validateAdminSession();
  const params = new URLSearchParams(await searchParams as Record<string, string>);
  const userList = await listUsersAsAdmin({
    page: params.get('page') ? parseInt(`${params.get('page')}`, 10) : 1,
    pageCount: params.get('page_count') ? parseInt(`${params.get('page_count')}`, 10) : 10,
    status: params.get('status') || 'all',
    order: params.get('order') === 'asc' ? 'asc' : 'desc',
    orderBy: params.get('orderBy') || undefined
  });
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        {`Manage ${USER_LABEL}s`}
      </h1>

      <AdminUserList userList={userList} searchParams={params} />
    </>
  );
}
