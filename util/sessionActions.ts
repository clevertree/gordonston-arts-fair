/* eslint-disable no-console */

'use server';

import { endSession, startSession, validateSession } from '@util/session';
import { sendMail } from '@util/emailActions';
import { randomInt } from 'node:crypto';
import { HttpError } from '@util/exception/httpError';
import { getPGSQLClient } from '@util/pgsql';
import { UserTableRow } from '@util/schema';
import { isAdmin } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { formatPhoneInput, sendSMSMessage } from '@util/phoneActions';
import { User2FactorEmailTemplate, UserRegistrationEmailTemplate } from '../template/email';
import User2FactorSMSTemplate from '../template/sms/user-2factor-sms';
import UserRegistrationSMSTemplate from '../template/sms/user-registration-sms';

export type ActionResponse = {
  status: 'success' | 'error';
  message: string;
  redirectURL?: string;
};

const LOGIN_EMAIL_REQUESTS: {
  [email: string]: number;
} = {};

export async function loginEmailAction(email: string): Promise<ActionResponse> {
  const loginCode = randomInt(100000, 999999 + 1);
  const timeout = process.env.TIMEOUT_2FACTOR_MINUTES || '15';
  // const redisPasswordResetKey = `user:${email.toLowerCase()}:reset-password`;
  // await redisClient.set(redisPasswordResetKey, resetCode, { EX: 60 * 15 });
  if (!LOGIN_EMAIL_REQUESTS[email]) {
    LOGIN_EMAIL_REQUESTS[email] = loginCode;
    setTimeout(() => {
      if (LOGIN_EMAIL_REQUESTS[email]) {
        delete LOGIN_EMAIL_REQUESTS[email];
        console.log('Email login request expired: ', email);
      }
    }, (parseInt(timeout, 10)) * 60 * 1000);
    const validationURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login/validate/email/?email=${email}&code=${loginCode}`;
    try {
      const emailTemplate = User2FactorEmailTemplate(email, loginCode, validationURL);
      await sendMail(emailTemplate);
      console.log('Sent email: ', emailTemplate.subject);
    } catch (e:any) {
      console.error('Unable to send email: ', e.message);
      return {
        status: 'error',
        message: 'Unable to send email. Please try again later',
      };
    }
  } else {
    console.log('Email 2-Factor re-requested: ', email);
  }

  const testMode = process.env.TEST_MODE !== 'false';
  return {
    status: 'success',
    message: 'A code has been sent to your email. Please enter it to continue',
    redirectURL: `/login/validate/email?email=${email}${
      testMode ? `&code=${loginCode}` : ''}`,
  };
}

export async function loginEmailValidationAction(
  email: string,
  code: number
): Promise<ActionResponse> {
  const storedCode = LOGIN_EMAIL_REQUESTS[email];
  if (!storedCode || (storedCode !== code)) {
    // eslint-disable-next-line no-console
    console.error('Invalid email login request:', email, storedCode, code);
    // Add an error log entry
    await addUserLogEntry(null, 'log-in-error', 'Invalid login request');
    return {
      message: 'Invalid login request',
      status: 'error',
    };
  }

  // Delete Login Request
  delete LOGIN_EMAIL_REQUESTS[email];

  const sql = getPGSQLClient();
  // Fetch user from the database
  const rows = (await sql`SELECT id
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  let userID: number = -1;
  if (rows.length > 0) {
    // User already exists
    userID = rows[0].id;
    // Add a log entry
    await addUserLogEntry(userID, 'log-in');
  } else {
    // Register a new user
    const result = await sql`INSERT INTO gaf_user (email, type, status, created_at)
                           VALUES (${email.toLowerCase()}, 'user', 'registered', now())
                           RETURNING id`;
    userID = result[0].id;
    console.log(`Registered a new user (${userID}): `, email);

    // Add a log entry
    await addUserLogEntry(userID, 'register');

    // Send the registration email
    const loginURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    const emailTemplate = UserRegistrationEmailTemplate(email, loginURL);
    const mailResult = await sendMail(emailTemplate);
    await addUserLogEntry(userID, mailResult.success ? 'message' : 'message-error', mailResult.message);
  }

  await startSession(userID);

  // eslint-disable-next-line no-console
  console.error('User logged in by email: ', email);
  return {
    status: 'success',
    message: 'Login successful. Redirecting...',
    redirectURL: (await isAdmin(userID)) ? '/user' : '/profile'
  };
}

/** Phone Validation * */

const LOGIN_PHONE_REQUESTS: {
  [phone: string]: number;
} = {};

export async function loginPhoneAction(unformattedPhone: string): Promise<ActionResponse> {
  const phone = formatPhoneInput(unformattedPhone);
  const loginCode = randomInt(100000, 999999 + 1);
  const timeout = process.env.TIMEOUT_2FACTOR_MINUTES || '15';
  // const redisPasswordResetKey = `user:${phone.toLowerCase()}:reset-password`;
  // await redisClient.set(redisPasswordResetKey, resetCode, { EX: 60 * 15 });
  if (!LOGIN_PHONE_REQUESTS[phone]) {
    LOGIN_PHONE_REQUESTS[phone] = loginCode;

    setTimeout(() => {
      if (LOGIN_EMAIL_REQUESTS[phone]) {
        delete LOGIN_PHONE_REQUESTS[phone];
        console.log('Phone login request expired: ', phone);
      }
    }, (parseInt(timeout, 10)) * 60 * 1000);
    const validationURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login/validate/phone/?phone=${phone}&code=${loginCode}`;
    try {
      const phoneTemplate = User2FactorSMSTemplate(phone, loginCode, validationURL);
      await sendSMSMessage(phoneTemplate);
      console.log('Sent phone: ', phoneTemplate.message);
    } catch (e:any) {
      console.error('Unable to send phone: ', e.message);
      return {
        status: 'error',
        message: 'Unable to send phone. Please try again later',
      };
    }
  } else {
    console.log('Phone 2-Factor re-requested: ', phone);
  }

  return {
    status: 'success',
    message: 'A code has been sent to your phone. Please enter it to continue',
    redirectURL: `/login/validate/phone?phone=${phone}`
  };
}

export async function loginPhoneValidationAction(
  phone: string,
  code: number
): Promise<ActionResponse> {
  const storedCode = LOGIN_PHONE_REQUESTS[phone];
  if (!storedCode || (storedCode !== code)) {
    // eslint-disable-next-line no-console
    console.error('Invalid phone login request:', phone, storedCode, code, LOGIN_PHONE_REQUESTS);
    // Add an error log entry
    await addUserLogEntry(null, 'log-in-error', 'Invalid login request');
    return {
      message: 'Invalid login request',
      status: 'error',
    };
  }

  // Delete Login Request
  delete LOGIN_PHONE_REQUESTS[phone];

  const sql = getPGSQLClient();
  // Fetch user from the database
  const rows = (await sql`SELECT id
                          FROM gaf_user
                          WHERE phone = ${phone}
                          LIMIT 1`) as UserTableRow[];
  let userID: number = -1;
  if (rows.length > 0) {
    // User already exists
    userID = rows[0].id;
    // Add a log entry
    await addUserLogEntry(userID, 'log-in');
  } else {
    // Register a new user
    const result = await sql`INSERT INTO gaf_user (phone, type, status, created_at)
                           VALUES (${phone}, 'user', 'registered', now())
                           RETURNING id`;
    userID = result[0].id;
    console.log(`Registered a new user (${userID}): `, phone);

    // Add a log entry
    await addUserLogEntry(userID, 'register');

    // Send the registration SMS
    const loginURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    const phoneTemplate = UserRegistrationSMSTemplate(phone, loginURL);
    const smsResult = await sendSMSMessage(phoneTemplate);
    await addUserLogEntry(userID, smsResult.success ? 'message' : 'message-error', smsResult.message);
  }

  await startSession(userID);

  // eslint-disable-next-line no-console
  console.error('User logged in by phone: ', phone);
  return {
    status: 'success',
    message: 'Login successful. Redirecting...',
    redirectURL: (await isAdmin(userID)) ? '/user' : '/profile'
  };
}

export async function logoutAction(): Promise<ActionResponse> {
  const oldSession = await endSession();
  const { userID } = oldSession;

  // Add a log entry
  await addUserLogEntry(userID, 'log-out');

  return {
    status: 'success',
    message: 'Log out successful. Redirecting...',
    redirectURL: '/login'
  };
}

export async function validateAdminSession() {
  const session = await validateSession();
  if (!await isAdmin(session.userID)) throw HttpError.Unauthorized('Unauthorized - Admin access required');
  return session;
}
