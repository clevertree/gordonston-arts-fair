import React from 'react';
import ProfileView from '@components/User/ProfileView';
import {UserFileUploadModel, UserModel} from '@util/models';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ApplicationPreviewProps {
    title?: string;
    userProfile: UserModel;
    userUploads: UserFileUploadModel[];
}

/**
 * Server component: Renders a collapsible preview of the artist's application
 * (profile + uploads) above checkout) using MUI Accordion, closed by default.
 */
export default function ApplicationPreview({
                                               title = 'Click here to preview your application submission',
                                               userProfile,
                                               userUploads,
                                           }: ApplicationPreviewProps) {
    return (
        <section aria-label="Application preview">
            <Accordion defaultExpanded={false} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>} aria-controls="application-preview-content"
                                  id="application-preview-header"
                >
                    <Typography component="h2" className="text-[color:var(--gold-color)] font-semibold ">
                        {title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                        This is a read-only preview of your profile and uploaded images.
                        To make changes, click the &#34;Edit Profile&#34; button above.
                    </Typography>
                    <ProfileView userProfile={userProfile} userUploads={userUploads}/>
                </AccordionDetails>
            </Accordion>
        </section>
    );
}
