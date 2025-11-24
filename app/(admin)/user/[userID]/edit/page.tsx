import ProfileEditor from '@components/User/ProfileEditor';
import {
    deleteFile as deleteFileAction,
    fetchProfileByID,
    fetchProfileStatus,
    updateFile as updateFileAction,
    updateProfile as updateProfileAction,
    uploadFile,
} from '@util/profileActions';
import {validateAdminSession} from '@util/session';
import Link from 'next/link';
import {Stack} from '@mui/material';
import React from 'react';
import {ProfileUploads} from "@components/User/ProfileUploads";

export const metadata = {
    title: 'Edit Artist Profile',
};

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function AdminEditUserProfilePage({
                                                           params,
                                                       }: {
    params: Promise<{ userID: number }>
}) {
    await validateAdminSession();

    const {userID} = await params;
    const userProfile = await fetchProfileByID(userID);
    const {
        status: profileStatus,
        uploads: userUploads
    } = await fetchProfileStatus(userProfile);

    return (
        <Stack spacing={2}>
            <h1 className="m-auto text-[color:var(--gold-color)] italic">Edit Artist Profile</h1>

            <Link
                href={`/user/${userProfile.id}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
                {`← Back to ${USER_LABEL} Management`}
            </Link>

            <ProfileEditor
                adminMode
                profileStatus={profileStatus}
                userProfile={userProfile.toJSON()}
                updateProfile={async (updated) => {
                    'use server';
                    return updateProfileAction(userProfile.id, updated);
                }}
            />
            <ProfileUploads
                adminMode
                userUploads={userUploads.map((u) => u.toJSON())}
                updateFile={async (file) => {
                    'use server';
                    return updateFileAction(userProfile.id, file);
                }}
                uploadFile={uploadFile}
                deleteFile={async (fileID) => {
                    'use server';
                    return deleteFileAction(userProfile.id, fileID);
                }}
            />
        </Stack>
    );
}
