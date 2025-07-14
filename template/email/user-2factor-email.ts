import Mail from 'nodemailer/lib/mailer';

export default function User2FactorEmailTemplate(
  to: string,
  loginCode: number,
  validationURL: string
):Mail.Options {
  const html = `<p>Dear Artist,</p>

<p>This is an email login request. Please enter the code below in your browser</p>

${loginCode}

<p>Alternately, you may click the link below to finish logging in</p>

<a href="${validationURL}">${validationURL || 'N/A'}</a>

<p>Kind regards,<br/>
The Gordonston Art Fair Committee</p>`;

  const text = html.replace(/<[^>]*>/g, '');

  return {
    to,
    subject: 'Email Login Request',
    html,
    text,
  };
}
