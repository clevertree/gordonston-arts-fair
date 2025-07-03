export type UserProfileStatus =
    'unregistered'
    | 'registered'
    | 'submitted'
    | 'approved'
    | 'standby'
    | 'declined'
    | 'paid'
    | 'imported';

export const profileStatuses: UserProfileStatus[] = [
  'unregistered',
  'registered',
  'submitted',
  'approved',
  'standby',
  'declined',
  'paid',
  'imported'
];

export interface UserProfile {
  email: string,
  status: UserProfileStatus,
  info: UserProfileInfo,
  uploads: {
    [filename: string]: UserProfileUpload
  }
  createdAt: number,
  updatedAt?: number,
  isAdmin?: true,
  // expiresAt: Date
}

export interface UserProfileInfo {
  firstName?: string,
  lastName?: string,
  companyName?: string,
  phone?: string,
  phone2?: string,
  website?: string,
  address?: string,
  city?: string,
  state?: string,
  zip?: string,
  category?: string,
  description?: string,
}

export interface UserProfileUpload {
  title: string,
  description?: string,
  url?: string
  // path: string
}

export function isProfileComplete(profileData: UserProfile) {
  if (!profileData) return 'No profile data found';

  const {
    info,
    uploads
  } = profileData;

  if (!info) return 'No profile info found';
  if (!uploads) return 'No profile uploads found';

  const {
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    zip,
    category,
    description
  } = info;

  if (!firstName) return 'First Name is required';
  if (!lastName) return 'Last name is required';
  if (!phone) return 'Phone number is required';
  if (!address) return 'Address is required';
  if (!city) return 'City is required';
  if (!state) return 'State is required';
  if (!zip) return 'ZIP code is required';
  if (!category) return 'Category is required';
  if (!description) return 'Description is required';

  if (!uploads || Object.keys(uploads).length === 0) return 'At least one upload is required';

  return true;
}

export function getFullName(firstName?: string, lastName?: string) {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return 'N/A';
}

export function getStatusName(status?: UserProfileStatus) {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
