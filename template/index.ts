import * as EmailAccepted from './email-accepted';
import * as EmailDeclined from './email-declined';
import * as EmailStandby from './email-standby';

export interface EmailTemplate {
  name: string
  subject: string
  textBody: string
}

export const templateList : EmailTemplate[] = [
  EmailAccepted,
  EmailDeclined,
  EmailStandby
];
