'use server';

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

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
  let isVerified = false;
  try {
    isVerified = await transporter.verify();
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return { success: false, message: `Unable to send email: ${error.message}` };
  }
  if (process.env.TEST_MODE !== 'false') {
    // eslint-disable-next-line no-console
    console.log('TEST MODE: Sending email to', options);
    return {
      success: true,
      message: 'TEST MODE: Email not sent',
    };
  }

  const info = await transporter.sendMail({
    from: EMAIL_ADMIN,
    bcc: EMAIL_BCC,
    ...options
  });
    // eslint-disable-next-line no-console
  console.log('Mail sent to', options.to, `verified=${isVerified}`, info.messageId);
  return {
    success: true,
    message: 'Email sent successfully',
  };
}
