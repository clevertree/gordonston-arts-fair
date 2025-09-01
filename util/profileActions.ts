/* eslint-disable no-console */

'use server';

import { del, put } from '@vercel/blob';
import { ensureDatabase } from '@util/database';
import { addUserLogEntry } from '@util/logActions';
import { imageDimensionsFromStream } from 'image-dimensions';
import { UserFileUploadModel, UserModel } from '@util/models';
import { UserStatus } from '@types';
import { getProfileStatus } from '@util/profile';
import { InferAttributes } from 'sequelize';
import { validateSession } from '@util/session';
import { validateAdminSession } from '@util/sessionActions';
import { HttpError } from '@util/exception/httpError';

export async function fetchProfileByID(userID: number): Promise<UserModel> {
  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);
  return userRow;
}

export async function updateProfile(updatedUserRow: InferAttributes<UserModel>) {
  const { userID } = await validateSession();
  if (updatedUserRow.id !== userID) {
    throw HttpError.Forbidden(
      'You are not authorized to update this profile'
    );
  }

  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);

  const updatedUserRowDB = await userRow.update({
    user_id: userID,
    ...updatedUserRow,
    phone: `${updatedUserRow.phone || ''}`.replace(/\D/g, ''),
    phone2: `${updatedUserRow.phone2 || ''}`.replace(/\D/g, ''),
  });
  const {
    status: profileStatus,
  } = await fetchProfileStatus(userID);
  return {
    message: 'Profile updated successfully.',
    result: profileStatus,
    updatedUserRow: updatedUserRowDB.toJSON(),
  };
}

export async function fetchProfileStatus(userID: number) {
  const userProfile = await fetchProfileByID(userID);
  const userUploads = await fetchUserFiles(userID);
  const profileStatus = getProfileStatus(userProfile, userUploads);
  return {
    status: profileStatus,
    user: userProfile,
    uploads: userUploads,
  };
}

export async function uploadFile(file: File) {
  const { userID } = await validateSession();

  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);

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

  const createAction = await UserFileUploadModel.create({
    user_id: userID,
    title: file.name,
    width,
    height,
    url: putResult.url
  });
  console.log('createAction', createAction);

  const {
    status: profileStatus,
  } = await fetchProfileStatus(userID);

  return {
    message: 'File uploaded successfully',
    result: profileStatus,
    // createAction,
  };
}

export async function deleteFile(fileID: number) {
  const session = await validateSession();

  await ensureDatabase();
  const fileUpload = await UserFileUploadModel.findOne({
    where: {
      id: fileID,
      user_id: session.userID,
    }
  });
  if (!fileUpload) throw new Error(`File ID not found: ${fileID}`);

  if (fileUpload.user_id !== session.userID) {
    throw HttpError.Forbidden(
      'You are not authorized to delete this file'
    );
  }

  try {
    await del(fileUpload.url);
    console.log('Deleted file: ', fileUpload.url);
  } catch (error: any) {
    console.error('Error deleting file: ', error);
  }
  const deleteAction = await UserFileUploadModel.destroy({
    where: {
      id: fileID,
      user_id: session.userID,
    }
  });

  const {
    status: profileStatus,
  } = await fetchProfileStatus(session.userID);
  return {
    message: 'File deleted successfully',
    result: profileStatus,
    deleteAction
  };
}

export async function updateFile(updatedFile: InferAttributes<UserFileUploadModel>) {
  const session = await validateSession();
  if (updatedFile.user_id !== session.userID) {
    throw HttpError.Forbidden(
      'You are not authorized to update this file'
    );
  }

  await ensureDatabase();

  const fileUpload = await UserFileUploadModel.findByPk(updatedFile.id);
  if (!fileUpload) throw new Error(`File ID not found: ${updatedFile.id}`);

  const {
    status: profileStatus,
  } = await fetchProfileStatus(session.userID);

  return {
    message: 'File description updated successfully',
    result: profileStatus,
    updateAction: fileUpload.update(updatedFile)
  };
}

export async function fetchUserFiles(userID: number) {
  await ensureDatabase();

  return UserFileUploadModel.findAll({
    where: { user_id: userID },
    order: [['createdAt', 'DESC']]
  });
}

export async function updateUserStatus(userID: number, newStatus: UserStatus, message: string) {
  await ensureDatabase();
  await validateAdminSession();
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
