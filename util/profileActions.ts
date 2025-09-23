/* eslint-disable no-console */

'use server';

import { del, put } from '@vercel/blob';
import { ensureDatabase } from '@util/database';
import { addUserUserLogModel } from '@util/logActions';
import { imageDimensionsFromStream } from 'image-dimensions';
import { UserFileUploadModel, UserModel } from '@util/models';
import { UserStatus } from '@types';
import { getProfileStatus } from '@util/profile';
import { InferAttributes } from 'sequelize';
import { validateSession } from '@util/session';
import { HttpError, UnauthorizedError } from '@util/exception/httpError';
import { currentUser } from '@clerk/nextjs/server';
import ArtistApprovedEmailTemplate from '@template/email/artist-approved-email';
import { sendMail } from '@util/emailActions';
import ArtistStandbyEmailTemplate from '@template/email/artist-standby-email';
import ArtistDeclinedEmailTemplate from '@template/email/artist-declined-email'; // For currentUser()

export async function fetchProfileByID(userID: number): Promise<UserModel> {
  await ensureDatabase();

  const userRow = await UserModel.findByPk(userID);
  if (!userRow) throw new Error(`User ID not found: ${userID}`);
  return userRow;
}

export async function fetchProfileFromSession(): Promise<UserModel> {
  await validateSession();
  const user = await currentUser();
  if (!user) {
    throw new UnauthorizedError(
      'No user was provided by Clerk. Please contact the site administrator to resolve this issue.'
    );
  }
  const email = `${user.primaryEmailAddress?.emailAddress}`.toLowerCase() || null;
  // const phone = `${user.primaryPhoneNumber?.phoneNumber}`.replace(/\D/g, '') || null;
  if (!email) {
    throw new UnauthorizedError(
      'No email was provided by Clerk. Please contact the site administrator to resolve this issue.'
    );
  }
  return fetchOrCreateProfileByEmail(email);
}

export async function fetchOrCreateProfileByEmail(email: string): Promise<UserModel> {
  await ensureDatabase();

  // if (email) {
  const userRow = await UserModel.findOne({
    where: {
      email
    }
  });
  if (userRow) return userRow;
  // } else if (phone) {
  //   const userRow = await UserModel.findOne({
  //     where: {
  //       phone
  //     }
  //   });
  //   if (userRow) return userRow;
  // } else {
  //   throw new UnauthorizedError(
  //     'No phone or email was provided by Clerk.
  //     Please contact the site administrator to resolve this issue.'
  //   );
  // }

  const newUser = await UserModel.create({
    email,
    // phone,
    type: 'user',
    status: 'registered',
    created_at: new Date(),
    updated_at: new Date(),
  });

  await addUserUserLogModel(newUser.id, 'register', 'User registered via Clerk');

  return newUser;
}

export async function updateProfile(updatedUserRow: InferAttributes<UserModel>) {
  const userProfile = await fetchProfileFromSession();

  const updatedUserRowDB = await userProfile.update({
    ...updatedUserRow,
    phone: `${updatedUserRow.phone || ''}`.replace(/\D/g, ''),
    phone2: `${updatedUserRow.phone2 || ''}`.replace(/\D/g, ''),
  });
  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);
  return {
    message: 'Profile updated successfully.',
    result: profileStatus,
    updatedUserRow: updatedUserRowDB.toJSON(),
  };
}

export async function fetchProfileStatus(userProfile: UserModel) {
  const userUploads = await fetchUserFiles(userProfile.id);
  const profileStatus = getProfileStatus(userProfile, userUploads);
  return {
    status: profileStatus,
    uploads: userUploads,
  };
}

export async function uploadFile(file: File) {
  const userProfile = await fetchProfileFromSession();

  const imagePath = `uploads/${userProfile.id}`;
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
    user_id: userProfile.id,
    title: file.name,
    width,
    height,
    url: putResult.url
  });
  console.log('createAction', createAction);

  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);

  return {
    message: 'File uploaded successfully',
    result: profileStatus,
    // createAction,
  };
}

export async function deleteFile(fileID: number) {
  const userProfile = await fetchProfileFromSession();

  const fileUpload = await UserFileUploadModel.findOne({
    where: {
      id: fileID,
      user_id: userProfile.id,
    }
  });
  if (!fileUpload) throw new Error(`File ID not found: ${fileID}`);

  try {
    await del(fileUpload.url);
    console.log('Deleted file: ', fileUpload.url);
  } catch (error: any) {
    console.error('Error deleting file: ', error);
  }
  const deleteAction = await UserFileUploadModel.destroy({
    where: {
      id: fileID,
      user_id: userProfile.id,
    }
  });

  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);
  return {
    message: 'File deleted successfully',
    result: profileStatus,
    deleteAction
  };
}

export async function updateFile(updatedFile: InferAttributes<UserFileUploadModel>) {
  const userProfile = await fetchProfileFromSession();
  if (updatedFile.user_id !== userProfile.id) {
    throw HttpError.Forbidden(
      'You are not authorized to update this file'
    );
  }

  await ensureDatabase();

  const fileUpload = await UserFileUploadModel.findByPk(updatedFile.id);
  if (!fileUpload) throw new Error(`File ID not found: ${updatedFile.id}`);

  const {
    status: profileStatus,
  } = await fetchProfileStatus(userProfile);

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

export async function updateUserStatus(
  userID: number,
  newStatus: UserStatus,
  message: string,
  sendEmailTemplate: boolean = true
) {
  await ensureDatabase();
  const userProfile = await fetchProfileByID(userID);
  await UserModel.update(
    {
      status: newStatus,
      updated_at: new Date()
    },
    {
      where: { id: userProfile.id }
    }
  );

  // Add a log entry
  await addUserUserLogModel(userID, 'status-change', message);

  if (sendEmailTemplate && userProfile.email) {
    const emailTemplate = await getUserStatusEmailTemplate(userID, newStatus);
    if (emailTemplate) {
      await sendMail(emailTemplate);
      return {
        message: `Status updated successfully to ${newStatus}. Email sent to artist.`,
      };
    }
    return {
      message: `Status updated successfully to ${newStatus}. No Email template is associate with status change.`,
    };
  }

  return {
    message: `Status updated successfully to ${newStatus}. No Email was sent`,
  };
}

export async function getUserStatusEmailTemplate(userID: number, status: UserStatus) {
  await ensureDatabase();
  const userProfile = await fetchProfileByID(userID);
  switch (status) {
    case 'approved':
      return ArtistApprovedEmailTemplate(
        userProfile,
      );
    case 'standby':
      return ArtistStandbyEmailTemplate(
        userProfile,
      );
    case 'declined':
      return ArtistDeclinedEmailTemplate(
        userProfile,
      );
    default:
      return null;
  }
}
