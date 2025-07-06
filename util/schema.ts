export type UserStatus =
    'unregistered'
    | 'registered'
    | 'submitted'
    | 'approved'
    | 'standby'
    | 'declined'
    | 'paid'
    | 'imported';

export const profileStatuses: UserStatus[] = [
  'unregistered',
  'registered',
  'submitted',
  'approved',
  'standby',
  'declined',
  'paid',
  'imported'
];

export interface UserFileUploadDescription {
  title: string,
  description?: string,
  url?: string
  width: number,
  height: number,
}

export type UserTableRow = {
  id: number; // Primary key, auto-incremented
  email: string; // Unique and required
  type: 'user' | 'admin'; // Unique and required
  password?: string; // Unique and required
  first_name?: string; // Required
  last_name?: string; // Required
  company_name?: string | null; // Optional
  address?: string; // Required
  city?: string; // Required
  state?: string; // Required, likely a short code (e.g., 'CA')
  zipcode?: string; // Required
  phone?: string; // Required
  phone2?: string | null; // Optional
  website?: string | null; // Optional
  description?: string; // Required
  category?: string; // Required
  status: UserStatus;
  created_at?: string; // Required timestamp in ISO format
  updated_at?: string | null; // Optional timestamp in ISO format
  uploads?: {
    [filename: string]: UserFileUploadDescription
  },
  // Non DB fields
  isProfileComplete?: true | string
};

export type NewUserTableRow = Omit<UserTableRow, 'id' | 'created_at' | 'updated_at'>;
export type UpdatedUserTableRow = Partial<NewUserTableRow>;
