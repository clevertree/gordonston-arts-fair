import { JWTPayload } from 'jose';

export interface SMSMessage {
  phone: string;
  message: string;
}

export interface SessionPayload extends JWTPayload {
  userID: number,
  // expiresAt: Date
}

export type ActionResponse = {
  status: 'success' | 'error';
  message: string;
  redirectURL?: string;
};
