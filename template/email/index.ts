import * as ArtistSubmitted from '@template/email/ArtistSubmittedTemplate.mdx';
import * as ArtistApproved from '@template/email/ArtistApprovedTemplate.mdx';
import * as ArtistDeclined from '@template/email/ArtistDeclinedTemplate.mdx';
import * as ArtistStandby from '@template/email/ArtistStandbyTemplate.mdx';

export {
    ArtistSubmitted as ArtistSubmittedTemplate,
    ArtistApproved as ArtistApprovedTemplate,
    ArtistDeclined as ArtistDeclinedTemplate,
    ArtistStandby as ArtistStandbyTemplate,
};
import {MDXProps} from "mdx/types";

export const templateList: EmailTemplate[] = [
    ArtistSubmitted,
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