import React from 'react';
import { UserFileUploadModel } from '@util/models';
import { InferAttributes } from 'sequelize';
import { ProfileUploadForm } from '@components/User/ProfileUploadForm';

describe('<ProfileUploadForm />', () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    cy.injectAxe();
  });
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount((
      <ProfileUploadFormWrapper />));
    cy.checkA11y();
  });
});

function ProfileUploadFormWrapper() {
  const [fileUpload, setFileUpload] = React.useState<InferAttributes<UserFileUploadModel>>(() => ({
    id: 0,
    title: 'test',
    width: 100,
    height: 100,
    url: 'https://ttfmqae8x58lkhvg.public.blob.vercel-storage.com/profile/ari%40asu.edu/uploads/morrowindinstallorder1.png',
    user_id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserFileUploadModel));
  return (
    <ProfileUploadForm
      fileUpload={fileUpload as UserFileUploadModel}
      updateFile={async (p) => {
        setFileUpload(p);
        return {
          message: 'File updated successfully.',
          result: {
            status: 'registered',
            complete: false,
            formFilled: false,
            message: 'Please complete your Artist profile.'
          },
        };
      }}
      deleteFile={cy.stub()}
    />
  );
}
