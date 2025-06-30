import {Alert, Stack} from "@mui/material";
import Link from "next/link";

import ProfileView from "@components/Profile/ProfileView";
import {fetchUserResult} from "@util/userActions";
import {validateAdminSession} from "@util/sessionActions";
import UserStatusEditorAdmin from "@components/Admin/UserStatusEditorAdmin";
import {updateUserStatus} from "@util/profileActions";

// export const metadata = {
//     title: 'Manage an Artist',
// }

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function AdminUserManagementPage({
                                                          params,
                                                      }: {
    params: Promise<{ email: string }>
}) {
    await validateAdminSession();

    const {email} = await params;
    const emailFormatted = email.replace('%40', '@');
    const {profile, status} = await fetchUserResult(emailFormatted);

    return <>
        <h2 className='m-auto text-[color:var(--gold-color)] italic'>Manage an Artist</h2>
        <Stack spacing={2} padding={2}>


            <Link
                href="/user"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
                ← Back to {USER_LABEL} List
            </Link>

            {profile
                ? <>
                    <UserStatusEditorAdmin userStatus={status}
                                           updateUserStatus={async (status) => {
                                               'use server'
                                               return await updateUserStatus(emailFormatted, status);
                                           }}/>
                    <ProfileView userProfile={profile} userStatus={status}/>
                </>
                : <Alert severity='error'>{USER_LABEL} profile not found for {emailFormatted}</Alert>}


        </Stack>
    </>
}
