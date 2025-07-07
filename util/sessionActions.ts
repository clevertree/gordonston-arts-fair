'use server';

import bcrypt from 'bcrypt';
import { endSession, startSession, validateSession } from '@util/session';
import { sendTemplateMail } from '@util/emailActions';
import { randomBytes } from 'node:crypto';
import { HttpError } from '@util/exception/httpError';
import { UserPasswordResetEmailTemplate, UserRegistrationEmailTemplate } from '@email';
import { getPGSQLClient } from '@util/pgsql';
import { UserTableRow } from '@util/schema';
import { fetchUserID, isAdmin } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { LOGIN_ERROR_MESSAGE } from '@util/messageUtil';
import { fetchProfileByEmail } from '@util/profileActions';

export type ActionResponse = {
  status: 'success' | 'error';
  message: string;
  redirectURL?: string;
};

export async function loginAction(email: string, password: string): Promise<ActionResponse> {
  const sql = getPGSQLClient();
  // Fetch user from the database
  const rows = (await sql`SELECT id, password
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  if (!rows[0]) {
    // Add a log entry
    // eslint-disable-next-line no-console
    console.error('User not found: ', email);
    await addUserLogEntry(null, 'log-in-error', `Email not found: ${email}`);
    return {
      message: LOGIN_ERROR_MESSAGE,
      status: 'error'
    };
  }
  const { id, password: passwordHash } = rows[0];

  const passwordResult = passwordHash && await bcrypt.compare(password, passwordHash);
  if (!passwordResult) {
    // Add an error log entry
    await addUserLogEntry(id, 'log-in-error', `Invalid password: ${email}`);
    // eslint-disable-next-line no-console
    console.error('Invalid password: ', email);
    return {
      message: LOGIN_ERROR_MESSAGE,
      status: 'error'
    };
  }

  await startSession(email);

  // Add a log entry
  await addUserLogEntry(id, 'log-in');

  // eslint-disable-next-line no-console
  console.error('User logged in: ', email);
  return {
    status: 'success',
    message: 'Login successful. Redirecting...',
    redirectURL: (await isAdmin(email)) ? '/user' : '/profile'
  };
}

export async function logoutAction(): Promise<ActionResponse> {
  const oldSession = await endSession();
  const id = await fetchUserID(oldSession.email);

  // Add a log entry
  await addUserLogEntry(id, 'log-out');

  return {
    status: 'success',
    message: 'Log out successful. Redirecting...',
    redirectURL: '/login'
  };
}

export async function registerAction(email: string, password: string): Promise<ActionResponse> {
  const sql = getPGSQLClient();
  const rows = (await sql`SELECT id
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  if (rows.length > 0) {
    // Add an error log entry
    await addUserLogEntry(rows[0].id, 'register-error', 'User already exists');
    console.error('User already exists:', email);
    return {
      message: 'User already exists with this email. Please log in or reset your password',
      status: 'error'
    };
  }

  // Store user in the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await sql`INSERT INTO gaf_user (email, type, status, password, created_at)
                           VALUES (${email.toLowerCase()}, 'user', 'registered', ${hashedPassword}, now())
                           RETURNING id`;
  const userID = result[0].id;
  console.log(`Registered a new user (${userID}): `, email);

  // Create the user session
  await startSession(email);

  // Add a log entry
  await addUserLogEntry(userID, 'register');

  // Send the registration email
  await sendTemplateMail(email, UserRegistrationEmailTemplate);

  return {
    status: 'success',
    message: 'Registration complete. Please check your email for a confirmation link',
    redirectURL: '/profile'
  };
}

const PASSWORD_RESET_REQUESTS: {
  [email: string]: string;
} = {};
export async function passwordResetAction(email: string): Promise<ActionResponse> {
  const sql = getPGSQLClient();
  // Fetch user from the database
  const rows = (await sql`SELECT id, password
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  const message = `If a user account exists, a password reset will be sent to your email address at ${email}`;
  if (!rows[0]) {
    // Add a log entry
    await addUserLogEntry(null, 'password-reset-error', `Email not found: ${email}`);
    return {
      message,
      status: 'error'
    };
  }
  const { id } = rows[0];

  // Store password reset request
  const resetCode = Buffer.from(randomBytes(36)).toString('hex');
  const timeout = process.env.PASSWORD_RESET_TIMEOUT_MINUTES || '15';
  // const redisPasswordResetKey = `user:${email.toLowerCase()}:reset-password`;
  // await redisClient.set(redisPasswordResetKey, resetCode, { EX: 60 * 15 });
  PASSWORD_RESET_REQUESTS[email] = resetCode;
  setTimeout(() => {
    delete PASSWORD_RESET_REQUESTS[email];
  }, (parseInt(timeout, 10)) * 60 * 1000);

  // eslint-disable-next-line no-console
  console.log('Password reset request: ', email, resetCode);

  // Send the password reset email
  const validationURL = `${process.env.NEXT_PUBLIC_METADATA_URL}/password/validate/${email}/${resetCode}`;
  await sendTemplateMail(email, UserPasswordResetEmailTemplate, { validationURL });
  // await sendMail({
  //   to: email,
  //   html: `<a href='${url}'>Click here to reset your password</a>`,
  //   text: `Open this link to reset your password: ${url}`,
  //   subject: 'Password Reset Request'
  // });

  // Add a log entry
  await addUserLogEntry(id, 'password-reset');

  return {
    status: 'success',
    message,
    // redirectURL: "/login"
  };
}

export async function passwordResetValidateAction(
  email: string,
  code: string,
  password: string
): Promise<ActionResponse> {
  const storedCode = PASSWORD_RESET_REQUESTS[email];
  if (!storedCode || (storedCode !== code)) {
    // eslint-disable-next-line no-console
    console.error('Invalid reset request:', email, storedCode, code);
    // Add an error log entry
    await addUserLogEntry(null, 'password-reset-error', 'Invalid password reset request');
    return {
      message: 'Invalid reset request',
      status: 'error',
    };
  }

  const user = await fetchProfileByEmail(email);

  // Delete the reset request
  delete PASSWORD_RESET_REQUESTS[email];

  // Update password in the database
  const sql = getPGSQLClient();
  const hashedPassword = await bcrypt.hash(password, 10);
  await sql`UPDATE gaf_user
            SET password   = ${hashedPassword},
                updated_at = NOW()
            WHERE id = ${user.id}`;

  console.log('Password was reset: ', email);

  // Add a log entry
  await addUserLogEntry(user.id, 'password-reset');

  return {
    status: 'success',
    message: 'Password was reset successfully. Please Log in',
    redirectURL: '/login'
  };
}

export async function validateAdminSession() {
  const session = await validateSession();
  if (!await isAdmin(session.email)) throw HttpError.Unauthorized('Unauthorized - Admin access required');
  return session;
}
