import {getRedisClient} from "@util/redis";
import {UserProfile} from "@util/profile";
import {list} from "@vercel/blob";

export function getImageUploadBlobPath(email: string) {
    return 'profile/' + email.toLowerCase() + '/uploads';

}

export async function fetchProfileData(email: string) {
    // Get redis client
    const redisClient = await getRedisClient();

    // Get profile data
    const profilePath = 'profile:' + email.toLowerCase();
    const profileString = await redisClient.get(profilePath);
    const profileData: UserProfile = profileString ? JSON.parse(profileString) : {};

    // Get uploaded image list
    const imagePath = getImageUploadBlobPath(email);
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
