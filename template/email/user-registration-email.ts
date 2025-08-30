import Mail from 'nodemailer/lib/mailer';

export default function UserRegistrationEmailTemplate(
  to: string,
  loginURL: string
):Mail.Options {
  const subject = 'Registration Confirmation';
  const html = `<p>Dear Artist,</p>

<p>Thank you for registering an artist account. Please use your email or phone number to log in and manage your profile.</p>

<a href="${loginURL}">${loginURL}</a>

<p>Kind regards,<br/>
The Gordonston Art Fair Committee</p>`;

  const text = html.replace(/<[^>]*>/g, '');

  return {
    to,
    subject,
    html,
    text,
  };
}
