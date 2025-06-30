import {Alert, Stack} from "@mui/material";
import Link from "next/link";

import ProfileView from "@components/Profile/ProfileView";
import {getUserInfoAsAdmin} from "@util/userActions";
import {validateAdminSession} from "@util/sessionActions";

export const metadata = {
    title: 'Manage an Artist',
}

export default async function PasswordResetValidationPage({
                                                              params,
                                                          }: {
    params: Promise<{ email: string }>
}) {
    await validateAdminSession();

    const {email} = await params;
    const emailFormatted = email.replace('%40', '@');
    const {profile} = await getUserInfoAsAdmin(emailFormatted);

    return <>
        <h2 className='m-auto text-[color:var(--gold-color)] italic'>Manage an Artist</h2>
        <Stack spacing={2} padding={2}>


            <Link
                href="/user"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
                ← Back to Users List
            </Link>

            {profile
                ? <ProfileView userProfile={profile}/>
                : <Alert severity='error'>User profile not found for {emailFormatted}</Alert>}

        </Stack>
    </>
}
