import Mail from 'nodemailer/lib/mailer';
import { UserModel } from '@util/models';
import AcceptedEmailTemplate from '@template/email/artist-approved-email';
import DeclinedEmailTemplate from '@template/email/artist-declined-email';
import StandbyEmailTemplate from '@template/email/artist-standby-email';

export type EmailTemplate = (userProfile: UserModel) => Mail.Options;

const templateList: EmailTemplate[] = [
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
];

export {
  AcceptedEmailTemplate,
  DeclinedEmailTemplate,
  StandbyEmailTemplate,
  templateList
};
