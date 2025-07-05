'use server';

import { del, list, put } from '@vercel/blob';
import { validateAdminSession } from '@util/sessionActions';
import { getPGSQLClient } from '@util/pgsql';
import { UpdatedUserTableRow, UserStatus, UserTableRow } from '@util/schema';
import { fetchUserID } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { isProfileComplete } from '@util/profile';

export async function fetchProfileByEmail(email: string) {
  // Get db client
  const sql = getPGSQLClient();

  const rows = (await sql`SELECT *
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()} LIMIT 1`) as UserTableRow[];
  if (!rows[0]) throw new Error(`User not found: ${email}`);
  return rows[0];
}

export async function fetchProfileByID(userID: number) {
  // Get db client
  const sql = getPGSQLClient();
  const rows = (await sql`SELECT *
                          FROM gaf_user
                          WHERE id = ${userID} LIMIT 1`) as UserTableRow[];
  if (!rows[0]) throw new Error(`User ID not found: ${userID}`);
  return rows[0];
}

export async function fetchProfileAndUploads(email: string) {
  const profileData = await fetchProfileByEmail(email);
  if (!profileData.uploads) profileData.uploads = {};

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
  profileData.isProfileComplete = isProfileComplete(profileData);
  return profileData;
}

export async function updateProfile(email: string, updatedUserRow: UpdatedUserTableRow) {
  const sql = getPGSQLClient();
  const userRow = await fetchProfileByEmail(email);
  Object.assign(userRow, updatedUserRow);
  const {
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
                updated_at   = NOW()`;
  return userRow;
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

export async function updateUserStatus(email: string, newStatus: UserStatus) {
  const adminSession = await validateAdminSession();
  const sql = getPGSQLClient();
  const id = await fetchUserID(email);
  await sql`UPDATE gaf_user
            SET status     = ${newStatus},
                updated_at = NOW()
            WHERE id = ${id} LIMIT 1`;

  // Add a log entry
  await addUserLogEntry(id, 'status-change', `${newStatus} set  by ${adminSession.email}`);

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
