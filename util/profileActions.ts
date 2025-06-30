'use server'

import {getRedisClient} from "@util/redis";
import {UserProfile} from "@util/profile";
import {del, list, put} from "@vercel/blob";
import {RedisJSON} from "@redis/json/dist/lib/commands";

export async function fetchProfile(email: string) {
    // Get redis client
    const redisClient = await getRedisClient();

    // Get profile data
    const profilePath = `user:${email.toLowerCase()}:profile`;
    const profileData = (await redisClient.json.get(profilePath)) as unknown as UserProfile;

    // Get uploaded images
    const imagePath = 'profile/' + email.toLowerCase() + '/uploads';
    const uploadList = await list({
        prefix: imagePath
    })
    const oldUploads = profileData.uploads || {}
    profileData.uploads = {};
    for (const upload of uploadList.blobs) {
        const filename = upload.pathname.split('/').pop()
        if (filename) {
            if (!profileData.uploads[filename]) {
                profileData.uploads[filename] = {
                    title: filename
                }
            }
            profileData.uploads[filename] = oldUploads[filename] || {title: filename}
            profileData.uploads[filename].url = upload.url;
        }
    }

    return profileData;
}

export async function updateProfile(email: string, newUserProfile: UserProfile) {
    const redisClient = await getRedisClient();
    const profileHash = `user:${email.toLowerCase()}:profile`;
    const oldUserProfile = (await redisClient.json.get(profileHash)) as unknown as UserProfile;
    const updatedUserProfile = {...oldUserProfile, ...newUserProfile} as unknown as RedisJSON
    await redisClient.json.set(profileHash, "$", updatedUserProfile);
    return updatedUserProfile;
}


export async function uploadFile(email: string, file: File) {
    const imagePath = 'profile/' + email.toLowerCase() + '/uploads';
    console.log("Uploading file: ", file.name);
    return await put(`${imagePath}/${file.name}`, file, {
        access: 'public',
        contentType: file.type,
        allowOverwrite: true
    });
}

export async function deleteFile(email: string, filename: string) {
    const imagePath = 'profile/' + email.toLowerCase() + '/uploads';
    console.log("Deleting file: ", `${imagePath}/${filename}`);
    await del(`${imagePath}/${filename}`);
}