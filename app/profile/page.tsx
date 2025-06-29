import ProfileEditor from "@components/Profile/ProfileEditor";
import {validateSession} from "@util/session";
import {deleteFile, fetchProfile, updateProfile, uploadFile} from "@util/profileActions";
import {UserProfile} from "@util/profile";

export const metadata = {
    title: 'Artist Profile',
}

export default async function ProfilePage() {
    const session = await validateSession()
    const profileData = await fetchProfile(session.email);

    async function updateProfileBind(newUserProfile: UserProfile) {
        'use server'
        return await updateProfile(session.email, newUserProfile);
    }

    async function uploadFileBind(filename: string, file: File) {
        'use server'
        return await uploadFile(session.email, filename, file);
    }

    async function deleteFileBind(filename: string) {
        'use server'
        return await deleteFile(session.email, filename);
    }

    return (
        <>
            <h2 className='m-auto text-[color:var(--gold-color)] italic'>Artist Profile</h2>

            <ProfileEditor userProfile={profileData}
                           uploadFile={uploadFileBind}
                           deleteFile={deleteFileBind}
                           updateProfile={updateProfileBind}/>
        </>
    );
}


