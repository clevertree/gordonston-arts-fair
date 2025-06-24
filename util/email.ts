'use server';
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
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
    } catch (error) {
        console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
        return;
    }
    const info = await transporter.sendMail({
        from: EMAIL_ADMIN,
        bcc: EMAIL_BCC,
        ...options
    });
    console.log('Mail sent to', options.to, 'verified=' + isVerified, info.messageId);
    return info;
}
