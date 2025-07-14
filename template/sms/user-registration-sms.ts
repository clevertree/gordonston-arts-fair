import { SMSMessage } from '../../types';

export default function UserRegistrationSMSTemplate(
  phone: string,
  loginURL: string
):SMSMessage {
  const message = `Dear Artist,
Thank you for registering an artist account. Please use your email or phone number to log in and manage your profile.

${loginURL}

Kind regards,
The Gordonston Art Fair Committee`;

  return {
    phone,
    message,
  };
}
