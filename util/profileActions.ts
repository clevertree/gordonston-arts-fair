'use server';

import { getRedisClient } from '@util/redis';
import { UserProfile, UserProfileStatus } from '@util/profile';
import { del, list, put } from '@vercel/blob';
import { RedisJSON } from '@redis/json/dist/lib/commands';
import { validateAdminSession } from '@util/sessionActions';

export async function fetchProfile(email: string) {
  // Get redis client
  const redisClient = await getRedisClient();

  // Get profile data
  const profilePath = `user:${email.toLowerCase()}:profile`;
  return await redisClient.json.get(profilePath) as unknown as UserProfile;
}

export async function fetchProfileAndUploads(email: string) {
  const profileData = await fetchProfile(email) || {
    uploads: {},
    status: 'registered'
  };

  // Get uploaded images
  const imagePath = `profile/${email.toLowerCase()}/uploads`;
  const uploadList = await list({
    prefix: imagePath
  });
  const oldUploads = profileData.uploads || {};
  profileData.uploads = {};
  for (const upload of uploadList.blobs) {
    const filename = upload.pathname.split('/').pop();
    if (filename) {
      if (!profileData.uploads[filename]) {
        profileData.uploads[filename] = {
          title: filename
        };
      }
      profileData.uploads[filename] = oldUploads[filename] || { title: filename };
      profileData.uploads[filename].url = upload.url;
    }
  }

  return profileData;
}

export async function updateProfile(email: string, newUserProfile: UserProfile) {
  const redisClient = await getRedisClient();
  const updatedUserProfile = await fetchProfile(email) || {
    status: 'unregistered',
    info: {},
    uploads: {},
    createdAt: new Date().getTime()
  };
  Object.assign(updatedUserProfile.info, newUserProfile.info);
  Object.assign(updatedUserProfile.uploads, newUserProfile.uploads);
  updatedUserProfile.updatedAt = new Date().getTime();
  // const updatedUserProfile: UserProfile = { ...oldUserProfile, ...newUserProfile };
  const profileHash = `user:${email.toLowerCase()}:profile`;
  await redisClient.json.set(profileHash, '$', updatedUserProfile as unknown as RedisJSON);
  return updatedUserProfile;
}

export async function uploadFile(email: string, file: File) {
  const imagePath = `profile/${email.toLowerCase()}/uploads`;
  // eslint-disable-next-line no-console
  console.log('Uploading file: ', file.name);
  return put(`${imagePath}/${file.name}`, file, {
    access: 'public',
    contentType: file.type,
    allowOverwrite: true
  });
}

export async function updateUserStatus(email: string, newStatus: UserProfileStatus) {
  const adminSession = await validateAdminSession();
  const redisClient = await getRedisClient();

  const profileHash = `user:${email.toLowerCase()}:profile`;
  await redisClient.json.set(profileHash, '$.status', newStatus);

  // Add a log entry
  const redisAccessLogKey = `user:${email.toLowerCase()}:log`;
  await redisClient.hSet(redisAccessLogKey, new Date().getTime(), `status:${newStatus}:by=${adminSession.email.toLowerCase()}`);

  return {
    message: 'Status updated successfully',
  };
}

export async function deleteFile(email: string, filename: string) {
  const imagePath = `profile/${email.toLowerCase()}/uploads`;
  // eslint-disable-next-line no-console
  console.log('Deleting file: ', `${imagePath}/${filename}`);
  await del(`${imagePath}/${filename}`);
}
