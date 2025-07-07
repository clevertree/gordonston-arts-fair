/* eslint-disable no-console */

'use server';

import { del, put } from '@vercel/blob';
import { validateAdminSession } from '@util/sessionActions';
import { getPGSQLClient } from '@util/pgsql';
import { UpdatedUserTableRow, UserStatus, UserTableRow } from '@util/schema';
import { fetchUserID } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { imageDimensionsFromStream } from 'image-dimensions';
import { isProfileComplete } from '@util/profile';

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

export async function updateProfile(email: string, updatedUserRow: UpdatedUserTableRow) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByEmail(email);
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

export async function uploadFile(email: string, file: File) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByEmail(email);
  const {
    uploads = {}
  } = userRow;

  const imagePath = `uploads/${email.toLowerCase()}`;
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

export async function deleteFile(email: string, filename: string) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByEmail(email);
  const {
    uploads = {}
  } = userRow;
  delete uploads[filename];
  await sql`UPDATE gaf_user
            SET uploads      = ${uploads},
                updated_at   = NOW()
                WHERE id = ${userRow.id}`;
  try {
    const imagePath = `profile/${email.toLowerCase()}/uploads`;
    // eslint-disable-next-line no-console
    await del(`${imagePath}/${filename}`);
    console.log('Deleted file: ', `${imagePath}/${filename}`);
  } catch (error: any) {
    console.error('Error deleting file: ', error);
  }
  return userRow;
}

export async function updateUserStatus(email: string, newStatus: UserStatus) {
  const adminSession = await validateAdminSession();
  const sql = getPGSQLClient();
  const id = await fetchUserID(email);
  await sql`UPDATE gaf_user
            SET status     = ${newStatus},
                updated_at = NOW()
            WHERE id = ${id}`;

  // Add a log entry
  await addUserLogEntry(id, 'status-change', `${newStatus} set  by ${adminSession.email}`);

  return {
    message: 'Status updated successfully',
  };
}
