/* eslint-disable no-console */

'use server';

import { del, put } from '@vercel/blob';
import { ensureDatabase } from '@util/database';
import { addUserLogEntry } from '@util/logActions';
import { imageDimensionsFromStream } from 'image-dimensions';
import { UserModel, UserUpdateModel } from '@util/models';
import { UserStatus } from '@types';

export async function fetchProfileByID(userID: number): Promise<UserModel> {
  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);
  return userRow;
}

export async function updateProfile(userID: number, updatedUserRow: UserUpdateModel) {
  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);
  Object.assign(userRow, updatedUserRow);
  userRow.phone = `${userRow.phone || ''}`.replace(/\D/g, '');
  userRow.phone2 = `${userRow.phone2 || ''}`.replace(/\D/g, '');

  await userRow.update(userRow);

  return userRow;
}

export async function uploadFile(userID: number, file: File) {
  await ensureDatabase();

  const userRow = await fetchProfileByID(userID);
  const {
    uploads = {}
  } = userRow;

  const imagePath = `uploads/${userID}`;
  const imageDimensions = await imageDimensionsFromStream(file.stream());
  if (!imageDimensions) throw new Error('Failed to get image dimensions');
  const { width, height } = imageDimensions;
  // eslint-disable-next-line no-console
  const fileName = `${width}-${height}/${file.name}`;

  console.log('Storing file: ', fileName, width, height);
  const putResult = await put(`${imagePath}/${fileName}`, file, {
    access: 'public',
    contentType: file.type,
    allowOverwrite: true
  });

  uploads[fileName] = {
    title: file.name,
    width,
    height,
    url: putResult.url
  };

  await userRow.update({
    uploads,
    updated_at: new Date()
  });

  return userRow;
}

export async function deleteFile(userID: number, filename: string) {
  await ensureDatabase();

  const userRow = await fetchProfileByID(userID);
  const {
    uploads = {}
  } = userRow;
  delete uploads[filename];

  await userRow.update({
    uploads,
    updated_at: new Date()
  });

  try {
    const imagePath = `profile/${userID}/uploads`;
    // eslint-disable-next-line no-console
    await del(`${imagePath}/${filename}`);
    console.log('Deleted file: ', `${imagePath}/${filename}`);
  } catch (error: any) {
    console.error('Error deleting file: ', error);
  }
  return userRow;
}

export async function updateUserStatus(userID: number, newStatus: UserStatus, message: string) {
  await ensureDatabase();

  await UserModel.update(
    {
      status: newStatus,
      updated_at: new Date()
    },
    {
      where: { id: userID }
    }
  );

  // Add a log entry
  await addUserLogEntry(userID, 'status-change', message);

  return {
    message: 'Status updated successfully',
  };
}
