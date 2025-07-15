/* eslint-disable @typescript-eslint/naming-convention */
// export interface UserProfile {
//   email: string,
//   status: UserStatus,
//   info: UserProfileInfo,
//   uploads: {
//     [filename: string]: UserProfileUpload
//   }
//   created_at: number,
//   updated_at?: number,
//   isAdmin?: true,
//   // expiresAt: Date
// }
//
// export interface UserProfileInfo {
//   first_name?: string,
//   last_name?: string,
//   company_name?: string,
//   phone?: string,
//   phone2?: string,
//   website?: string,
//   address?: string,
//   city?: string,
//   state?: string,
//   zip?: string,
//   category?: string,
//   description?: string,
// }
//
// export interface UserProfileUpload {
//   title: string,
//   description?: string,
//   url?: string
//   // path: string
// }

import { UserStatus, UserTableRow } from '@util/schema';

export function isProfileComplete(userRow: UserTableRow):[ boolean, string] {
  const {
    uploads
  } = userRow;

  const variables : { [key in keyof UserTableRow]?: string } = {
    first_name: 'First Name',
    last_name: 'Last Name',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipcode: 'ZIP Code',
    category: 'Category',
    description: 'Description',
    uploads: 'Uploads'
  };

  const fields = Object.keys(variables) as Array<keyof UserTableRow>;
  const missingFields = fields.filter((field) => !userRow[field]).length;
  if (missingFields > 0) return [false, 'Please complete your Artist Profile'];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (!userRow[field]) return [false, `${variables[field]} is required`];
  }

  if (!uploads || Object.keys(uploads).length === 0) return [false, 'At least one upload is required'];

  return [true, 'Profile is complete'];
}

export function getFullName(first_name?: string, last_name?: string) {
  if (first_name && last_name) return `${first_name} ${last_name}`;
  if (first_name) return first_name;
  if (last_name) return last_name;
  return 'N/A';
}

export function getStatusName(status?: UserStatus) {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
