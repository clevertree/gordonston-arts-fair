import {JWTPayload} from 'jose';

export interface SMSMessage {
  phone: string;
  message: string;
}

export interface SessionPayload extends JWTPayload {
  userID: number,
  authID: string
  // expiresAt: Date
}

export type ActionResponse = {
  status: 'success' | 'error';
  message: string;
  redirectURL?: string;
};
// User model types
export type UserStatus =
    'unregistered'
    | 'registered'
    | 'submitted'
    | 'approved'
    | 'standby'
    | 'declined'
    | 'paid'
    | 'imported';
export type UserType = 'user' | 'admin';
export type LogType =
    'log-in'
    | 'log-in-error'
    | 'log-out'
    | 'register'
    | 'password-reset'
    | 'message'
    | 'status-change'
    | 'error';

export const logTypes: LogType[] = [
  'log-in',
  'log-in-error',
  'log-out',
  'register',
  'password-reset',
  'message',
  'status-change',
  'error',
];

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
export type TransactionType = 'charge.succeeded' | 'charge.refunded';
export const transactionTypes: TransactionType[] = ['charge.succeeded', 'charge.refunded'];

export interface UserSearchParams {
  status?: string,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  limit?: number
}

export interface MailResult {
  status: 'success' | 'error';
  message: string;
}
