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

export function isProfileComplete(userRow: UserTableRow) {
  const {
    first_name,
    last_name,
    phone,
    address,
    city,
    state,
    zipcode,
    category,
    description,
    uploads
  } = userRow;

  if (!uploads) return 'No profile uploads found';
  if (!first_name) return 'First Name is required';
  if (!last_name) return 'Last name is required';
  if (!phone) return 'Phone number is required';
  if (!address) return 'Address is required';
  if (!city) return 'City is required';
  if (!state) return 'State is required';
  if (!zipcode) return 'ZIP code is required';
  if (!category) return 'Category is required';
  if (!description) return 'Description is required';

  if (!uploads || Object.keys(uploads).length === 0) return 'At least one upload is required';

  return true;
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
