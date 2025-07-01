interface UserPasswordResetProps {
  validationURL: string
}

export const name = 'user-password-reset';
export const subject = 'Password Reset Request';
export const htmlBody = ({ validationURL }:UserPasswordResetProps) => `<p>Dear Artist,</p>

<p>This is a password reset request. If you didn't make it, please disregard this email. Otherwise, please click the link to reset your password</p>

<a href="${validationURL}">${validationURL || 'N/A'}</a>

<p>Kind regards,<br/>
The Gordonston Art Fair Committee</p>`;

export const textBody = (props:UserPasswordResetProps) => htmlBody(props).replace(/<[^>]*>/g, '');
