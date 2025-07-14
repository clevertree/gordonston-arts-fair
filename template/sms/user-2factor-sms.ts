import { SMSMessage } from '../../types';

export default function User2FactorSMSTemplate(
  phone: string,
  loginCode: number,
  validationURL: string
):SMSMessage {
  const message = `Dear Artist,
This is an phone login request. Please enter the code below in your browser
${loginCode}
Alternately, you may click the link below to finish logging in
${validationURL}

Kind regards,
The Gordonston Art Fair Committee`;

  return {
    phone,
    message,
  };
}
