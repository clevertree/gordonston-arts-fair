import { getPGSQLClient } from '@util/pgsql';

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
  url: string
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
  uploads: {
    [filename: string]: UserFileUploadDescription
  },
};

export type NewUserTableRow = Omit<UserTableRow, 'id' | 'created_at' | 'updated_at'>;
export type UpdatedUserTableRow = Partial<NewUserTableRow>;

interface TwoFactorTableRow {
  type: 'email' | 'phone';
  receiver: string;
  code: number;
  expiration: Date;
}

export async function fetch2FACode(type: 'email' | 'phone', receiver: string) {
  const sql = getPGSQLClient();
  const rows = (await sql`SELECT *
                          FROM gaf_2fa_codes
                          WHERE type = ${type}
                            AND receiver = ${receiver}
                            AND expiration > NOW()
  `) as TwoFactorTableRow[];
  return rows.length > 0 ? rows[0] : null;
}

export async function add2FACode(type: 'email' | 'phone', receiver: string, code: number) {
  const timeout = Number.parseInt(process.env.TIMEOUT_2FACTOR_MINUTES || '15', 10);
  const sql = getPGSQLClient();
  await sql`INSERT INTO gaf_2fa_codes (type, receiver, code, expiration)
            VALUES (${type}, ${receiver}, ${code}, (NOW() + INTERVAL '1 minute' * ${timeout}))
            ON CONFLICT (type, receiver, code)
              DO UPDATE SET code       = ${code},
                            expiration = (NOW() + INTERVAL '1 minute' * ${timeout})`;
}

// Deletes all requests of type and receiver
export async function delete2FACode(type: 'email' | 'phone', receiver: string) {
  const sql = getPGSQLClient();
  await sql`DELETE
            FROM gaf_2fa_codes
            WHERE type = ${type}
              AND receiver = ${receiver}`;
}
