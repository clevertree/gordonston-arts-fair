import * as UserRegistrationEmailTemplate from './user-registration';
import * as UserPasswordResetEmailTemplate from './user-password-reset';
import * as ExhibitAcceptedEmailTemplate from './exhibit-accepted';
import * as ExhibitDeclinedEmailTemplate from './exhibit-declined';
import * as ExhibitStandbyEmailTemplate from './exhibit-standby';

export interface EmailTemplate {
  name: string
  subject: string
  textBody(props: any): string
  htmlBody(props: any): string
}

const testMode = process.env.TEST_MODE !== 'false';
const templateList: EmailTemplate[] = [
  ExhibitAcceptedEmailTemplate,
  ExhibitDeclinedEmailTemplate,
  ExhibitStandbyEmailTemplate,
  ...(testMode ? [
    UserRegistrationEmailTemplate,
    UserPasswordResetEmailTemplate,
  ] : []),
];

export {
  UserRegistrationEmailTemplate,
  UserPasswordResetEmailTemplate,
  ExhibitAcceptedEmailTemplate,
  ExhibitDeclinedEmailTemplate,
  ExhibitStandbyEmailTemplate,
  templateList
};
