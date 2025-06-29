import AdminUserList from "@components/admin/AdminUserList/AdminUserList";
import {validateSession} from "@util/session";

export const metadata = {
    title: 'Admin User List',
}

export default async function PasswordResetValidationPage() {
    const session = await validateSession()
    return (
        <>
            <h2 className='m-auto text-[color:var(--gold-color)] italic'>Artist Profile</h2>

            <AdminUserList/>
        </>
    );
}


