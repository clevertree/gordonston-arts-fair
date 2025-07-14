/* eslint-disable no-console */

'use server';

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { addUserLogEntry } from '@util/logActions';
import { getPGSQLClient } from '@util/pgsql';
import { UserTableRow } from '@util/schema';
import { startSession } from '@util/session';
import { isAdmin } from '@util/userActions';
import { randomInt } from 'node:crypto';
import { ActionResponse } from '@util/sessionActions';
import { User2FactorEmailTemplate, UserRegistrationEmailTemplate } from '../template/email';

const { SMTP_SERVER_HOST } = process.env;
const { SMTP_SERVER_USERNAME } = process.env;
const { SMTP_SERVER_PASSWORD } = process.env;
const EMAIL_ADMIN = process.env.NEXT_PUBLIC_EMAIL_ADMIN;
const EMAIL_BCC = process.env.NEXT_PUBLIC_EMAIL_BCC;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail(options: Mail.Options) {
  const email = `${options.to}`;
  const subject = `${options.subject}`;
  if (!email) {
    return { success: false, message: `Invalid recipient email: ${JSON.stringify(options)}` };
  }
  if (!subject) {
    return { success: false, message: `Invalid subject: ${JSON.stringify(options)}` };
  }

  const isVerified = await transporter.verify();

  const testMode = process.env.TEST_MODE !== 'false';
  if (!testMode) {
    const info = await transporter.sendMail({
      from: EMAIL_ADMIN,
      bcc: EMAIL_BCC,
      ...options
    });
    console.log('Mail sent to', email, `verified=${isVerified}`, info.messageId);
  } else {
    console.log('TEST MODE: No actual mail was sent', subject);
  }

  return {
    success: true,
    message: testMode
      ? `Email sent: ${subject}`
      : `TEST MODE: ${subject}`,
  };
}

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
    } catch (e: any) {
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
