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
    const userInfo = await getUserInfoAsAdmin(emailFormatted);

    return (
        <>
            <h2 className='m-auto text-[color:var(--gold-color)] italic'>Manage an Artist</h2>

            <ProfileView userProfile={userInfo.profile}/>
        </>
    );
}
