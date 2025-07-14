/* eslint-disable no-console */
// Initialize Stripe with type checking for the secret key
import { SMSMessage } from '../types';

export function formatPhoneInput(phone: string) {
  return phone.replace(/\D/g, '');
}

export async function sendSMSMessage({
  phone,
  message,
}:SMSMessage) {
  if (!process.env.TEXTBEE_API_KEY) {
    throw new Error('TEXTBEE_API_KEY is not defined');
  }

  if (!process.env.TEXTBEE_API_URL) {
    throw new Error('TEXTBEE_API_URL is not defined');
  }

  const testMode = process.env.TEST_MODE !== 'false';
  if (!testMode) {
    const response = await fetch(process.env.TEXTBEE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TEXTBEE_API_KEY,
      },
      body: JSON.stringify({
        recipients: [phone],
        message
      })
    });
    const responseJSON:SMSMessageResult = await response.json();

    console.log('SMS sent to', phone, responseJSON);
    return responseJSON;
  }
  console.log('TEST MODE: No actual SMS was sent');
  return {
    success: true,
    message: `TEST MODE: ${message}`,
  };
}

interface SMSMessageResult {
  success: boolean;
  message: string;
  smsBatchId: string;
  recipientCount: number
}
