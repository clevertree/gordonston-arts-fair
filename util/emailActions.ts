'use server';

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { getRedisClient } from '@util/redis';

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
  if (!email) { return { success: false, message: `Invalid recipient email: ${JSON.stringify(options)}` }; }
  if (!subject) { return { success: false, message: `Invalid subject: ${JSON.stringify(options)}` }; }

  const redisClient = await getRedisClient();
  const redisAccessLogKey = `user:${email.toLowerCase()}:log`;

  let isVerified = false;
  try {
    isVerified = await transporter.verify();
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    // Add a log entry
    await redisClient.hSet(redisAccessLogKey, new Date().getTime(), `message:${error}`);
    return { success: false, message: `Unable to send email: ${error.message}` };
  }

  const testMode = process.env.TEST_MODE === 'false';
  if (testMode) {
    const info = await transporter.sendMail({
      from: EMAIL_ADMIN,
      bcc: EMAIL_BCC,
      ...options
    });
    // eslint-disable-next-line no-console
    console.log('Mail sent to', email, `verified=${isVerified}`, info.messageId);
  } else {
  // eslint-disable-next-line no-console
    console.log('TEST MODE: No actual mail was sent', options);
  }

  // Add a log entry
  await redisClient.hSet(redisAccessLogKey, new Date().getTime(), `message:${testMode ? 'TEST ONLY: ' : ''}${subject}`);

  return {
    success: true,
    message: 'Email sent successfully',
  };
}
