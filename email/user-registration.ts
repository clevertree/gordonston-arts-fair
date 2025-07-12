export const name = 'user-registration';
export const subject = 'Registration Confirmation';
const loginURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
export const htmlBody = () => `<p>Dear Artist,</p>

<p>Thank you for registering an artist account. Please use your email and password to log in and manage your profile.</p>

<a href="${loginURL}">${loginURL}</a>

<p>Kind regards,<br/>
The Gordonston Art Fair Committee</p>`;

export const textBody = () => htmlBody().replace(/<[^>]*>/g, '');
