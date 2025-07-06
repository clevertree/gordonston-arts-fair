/* eslint-disable no-console */

'use server';

import { del, list, put } from '@vercel/blob';
import { validateAdminSession } from '@util/sessionActions';
import { getPGSQLClient } from '@util/pgsql';
import { UpdatedUserTableRow, UserStatus, UserTableRow } from '@util/schema';
import { fetchUserID } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { isProfileComplete } from '@util/profile';
import { imageDimensionsFromStream } from 'image-dimensions';

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
  return fetchProfileUploads(profileData);
}

export async function fetchProfileUploads(profileData: UserTableRow) {
  if (!profileData.uploads) profileData.uploads = {};

  // Get uploaded images
  const imagePath = `uploads/${profileData.email.toLowerCase()}/`;
  const uploadList = await list({
    prefix: imagePath
  });
  const oldUploads = profileData.uploads || {};
  profileData.uploads = {};
  for (let i = 0; i < uploadList.blobs.length; i++) {
    const upload = uploadList.blobs[i];
    const [, , dimensionString, filename] = upload.pathname.split('/');
    if (filename) {
      const [widthString, heightString] = dimensionString.split('-');
      const width = parseInt(widthString, 10);
      const height = parseInt(heightString, 10);
      if (!profileData.uploads[filename]) {
        profileData.uploads[filename] = {
          title: filename,
          width,
          height
        };
      }
      profileData.uploads[filename] = oldUploads[filename] || { title: filename };
      profileData.uploads[filename].url = upload.url;
      profileData.uploads[filename].width = width;
      profileData.uploads[filename].height = height;
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
  const imagePath = `uploads/${email.toLowerCase()}`;
  const imageDimensions = await imageDimensionsFromStream(file.stream());
  if (!imageDimensions) throw new Error('Failed to get image dimensions');
  const { width, height } = imageDimensions;
  // eslint-disable-next-line no-console
  const fileName = `${width}-${height}/${file.name}`;

  console.log('Storing file: ', fileName, width, height);
  await put(`${imagePath}/${fileName}`, file, {
    access: 'public',
    contentType: file.type,
    allowOverwrite: true
  });
}

interface ImageDimensions {
  width: number;
  height: number;
}

function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    // Create a temporary URL for the file
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // Get the dimensions
      const dimensions = {
        width: img.width,
        height: img.height
      };

      // Clean up by revoking the temporary URL
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
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

export async function deleteFile(email: string, filename: string) {
  const imagePath = `profile/${email.toLowerCase()}/uploads`;
  // eslint-disable-next-line no-console
  console.log('Deleting file: ', `${imagePath}/${filename}`);
  await del(`${imagePath}/${filename}`);
}
