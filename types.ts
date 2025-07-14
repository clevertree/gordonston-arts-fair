import { JWTPayload } from 'jose';

export interface SMSMessage {
  phone: string;
  message: string;
}

export interface SessionPayload extends JWTPayload {
  userID: number,
  // expiresAt: Date
}
