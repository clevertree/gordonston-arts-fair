/* eslint-disable no-console */

'use server';

import { del, put } from '@vercel/blob';
import { getPGSQLClient } from '@util/pgsql';
import { UpdatedUserTableRow, UserStatus, UserTableRow } from '@util/schema';
import { addUserLogEntry } from '@util/logActions';
import { imageDimensionsFromStream } from 'image-dimensions';
import { isProfileComplete } from '@util/profile';

/** @deprecated  */
export async function fetchProfileByEmail(email: string) {
  // Get db client
  const sql = getPGSQLClient();

  const [userRow] = (await sql`SELECT u.*
                               FROM gaf_user as u
                               WHERE email = ${email.toLowerCase()} LIMIT 1`) as UserTableRow[];
  if (!userRow) throw new Error(`User not found: ${email}`);
  if (!userRow.uploads) userRow.uploads = {};
  userRow.isProfileComplete = isProfileComplete(userRow);
  return userRow;
}

export async function fetchProfileByID(userID: number) {
  // Get db client
  const sql = getPGSQLClient();

  const [userRow] = (await sql`SELECT u.*
                               FROM gaf_user as u
                          WHERE id = ${userID} LIMIT 1`) as UserTableRow[];
  if (!userRow) throw new Error(`User ID not found: ${userID}`);
  if (!userRow.uploads) userRow.uploads = {};
  userRow.isProfileComplete = isProfileComplete(userRow);
  return userRow;
}

export async function updateProfile(userID: number, updatedUserRow: UpdatedUserTableRow) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByID(userID);
  Object.assign(userRow, updatedUserRow);
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    first_name, last_name, company_name,
    address, city, state, zipcode, phone, phone2, website,
    description, category, uploads
  } = userRow;

  await sql`UPDATE gaf_user
            SET first_name   = ${first_name},
                last_name    = ${last_name},
                company_name = ${company_name},
                address      = ${address},
                city         = ${city},
                state        = ${state},
                zipcode      = ${zipcode},
                phone        = ${phone},
                phone2       = ${phone2},
                website      = ${website},
                description  = ${description},
                category     = ${category},
                uploads      = ${uploads},
                updated_at   = NOW()
                WHERE id = ${userRow.id}`;
  return userRow;
}

export async function uploadFile(userID: number, file: File) {
  const sql = getPGSQLClient();
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
  await sql`UPDATE gaf_user
            SET uploads      = ${uploads},
                updated_at   = NOW()
                WHERE id = ${userRow.id}`;
  return userRow;
}

export async function deleteFile(userID: number, filename: string) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByID(userID);
  const {
    uploads = {}
  } = userRow;
  delete uploads[filename];
  await sql`UPDATE gaf_user
            SET uploads      = ${uploads},
                updated_at   = NOW()
                WHERE id = ${userRow.id}`;
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

export async function updateUserStatus(userID: number, newStatus: UserStatus, message:string) {
  const sql = getPGSQLClient();
  await sql`UPDATE gaf_user
            SET status     = ${newStatus},
                updated_at = NOW()
            WHERE id = ${userID}`;

  // Add a log entry
  await addUserLogEntry(userID, 'status-change', message);

  return {
    message: 'Status updated successfully',
  };
}
