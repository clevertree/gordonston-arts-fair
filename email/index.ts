import * as UserRegistrationEmailTemplate from './user-registration';
import * as UserPasswordResetEmailTemplate from './user-password-reset';
import * as AcceptedEmailTemplate from './accepted';
import * as DeclinedEmailTemplate from './declined';
import * as StandbyEmailTemplate from './standby';

export interface EmailTemplate {
  name: string
  subject: string

  textBody(props: any): string

  htmlBody(props: any): string
}

const testMode = process.env.TEST_MODE !== 'false';
const templateList: EmailTemplate[] = [
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
  ...(testMode ? [
    UserRegistrationEmailTemplate,
    UserPasswordResetEmailTemplate,
  ] : []),
];

export {
  UserRegistrationEmailTemplate,
  UserPasswordResetEmailTemplate,
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
  templateList
};
