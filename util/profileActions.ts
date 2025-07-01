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
  const profileData = (await redisClient.json.get(profilePath)) as unknown as UserProfile || {
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
  const profileHash = `user:${email.toLowerCase()}:profile`;
  const oldUserProfile = (await redisClient.json.get(profileHash)) as unknown as UserProfile;
  const updatedUserProfile: UserProfile = { ...oldUserProfile, ...newUserProfile };
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
  const profileHash = `user:${email.toLowerCase()}:status`;
  await redisClient.set(profileHash, newStatus);

  // Add a log entry
  const redisAccessLogKey = `user:${email.toLowerCase()}:log:status`;
  await redisClient.zAdd(redisAccessLogKey, [
    {
      value: `${newStatus}:${adminSession.email.toLowerCase()}`,
      score: new Date().getTime()
    }
  ]);

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
