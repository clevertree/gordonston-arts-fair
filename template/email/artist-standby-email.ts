import { formatDate } from '@util/date';
import Mail from 'nodemailer/lib/mailer';

export default function ArtistStandbyEmailTemplate(
  to: string,
):Mail.Options {
  const eventDate = new Date(`${process.env.NEXT_PUBLIC_EVENT_DATE}`);
  const subject = 'Your exhibit has been put on standby';
  const html = `<p>Dear Artist,</p>

<p>The jury results for the Gordonston Art Fair to be held on ${formatDate(eventDate)} are as follows:</p>

<p>Since this is a juried show, we are limited to the number of exhibitors we can accept. Unfortunately, much good work had to be juried out, but because of the high quality of your work, you have been placed on a stand by list. We will notify you if and when spaces become available.</p>

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
