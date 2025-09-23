import Mail from 'nodemailer/lib/mailer';
import { UserModel } from '@util/models';

export default function ArtistDeclinedEmailTemplate(
  { email: to }: UserModel,
):Mail.Options {
  const subject = 'Your exhibit has been declined';

  const html = `<p>Dear Artist,</p>

<p>After thoughtful consideration, the Gordonston Art Fair regrets to inform you that your work was not accepted for our show this year.</p>

<p>Because this is a juried show, we are limited to the number of exhibitors we can accept. Unfortunately, a lot of good work had to be juried out. We appreciate the opportunity to view your work and wish you the best in the future.</p>

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
