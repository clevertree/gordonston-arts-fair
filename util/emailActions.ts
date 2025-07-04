/* eslint-disable no-console */

'use server';

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailTemplate } from '@email';
import { addUserLogEntry } from '@util/logActions';
import { fetchProfileByID } from '@util/profileActions';

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

// TODO: allow overrides
export async function sendTemplateMail(userID: number, template: EmailTemplate, props: any = {}) {
  const { email } = await fetchProfileByID(userID);
  try {
    const messageInfo = {
      to: email,
      html: template.htmlBody(props),
      text: template.textBody(props),
      subject: template.subject
    };
    await sendMail(messageInfo);

    // Add a log entry
    const testMode = process.env.TEST_MODE !== 'false';
    await addUserLogEntry(userID, 'message', `${testMode ? 'TEST ONLY: ' : ''}${messageInfo.subject}`);

    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error: any) {
    await addUserLogEntry(userID, 'message-error', error.message);
    return { success: false, message: `Unable to send email: ${error.message}` };
  }
}

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
    console.log('TEST MODE: No actual mail was sent', options);
  }

  return {
    success: true,
    message: 'Email sent successfully',
  };
}
