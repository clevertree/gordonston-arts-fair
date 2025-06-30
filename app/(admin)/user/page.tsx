import AdminUserList from "@components/admin/AdminUserList/AdminUserList";

import {validateAdminSession} from "@util/sessionActions";
import {listUsersAsAdmin} from "@util/userActions";

export const metadata = {
    title: 'Admin User List',
}

export default async function PasswordResetValidationPage() {
    await validateAdminSession();
    const userList = await listUsersAsAdmin()
    return (
        <>
            <h2 className='m-auto text-[color:var(--gold-color)] italic'>Manage Artists</h2>

            <AdminUserList userList={userList}/>
        </>
    );
}


