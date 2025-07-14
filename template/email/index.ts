import Mail from 'nodemailer/lib/mailer';
import UserRegistrationEmailTemplate from './user-registration-email';
import User2FactorEmailTemplate from './user-2factor-email';
import AcceptedEmailTemplate from './artist-accepted-email';
import DeclinedEmailTemplate from './artist-declined-email';
import StandbyEmailTemplate from './artist-standby-email';

export type EmailTemplate = (...args: any[]) => Mail.Options;

const testMode = process.env.TEST_MODE !== 'false';
const templateList: EmailTemplate[] = [
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
  ...(testMode ? [
    UserRegistrationEmailTemplate,
    User2FactorEmailTemplate,
  ] : []),
];

export {
  UserRegistrationEmailTemplate,
  // UserPasswordResetEmailTemplate,
  User2FactorEmailTemplate,
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
  templateList
};
