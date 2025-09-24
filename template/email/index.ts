import * as ArtistApproved from '@template/email/ArtistApprovedTemplate.mdx';
import * as ArtistDeclined from '@template/email/ArtistDeclinedTemplate.mdx';
import * as ArtistStandby from '@template/email/ArtistStandbyTemplate.mdx';

import {MDXProps} from "mdx/types";

export const templateList: EmailTemplate[] = [
  ArtistApproved,
  ArtistDeclined,
  ArtistStandby,
];

export interface EmailTemplate {
  default: React.FC<MDXProps>;
  subject: string;
  // html: string;
  // text: string;
}