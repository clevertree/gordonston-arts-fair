import React from 'react';
import { ProfileUploads } from '../ProfileUploads';

describe('<ProfileUploads />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <ProfileUploads
        userUploads={[]}
        uploadFile={cy.stub().resolves({ result: { status: 'registered' }, message: 'File uploaded' })}
        updateFile={cy.stub().resolves({ result: { status: 'registered' }, message: 'File updated' })}
        deleteFile={cy.stub().resolves({ result: { status: 'registered' }, message: 'File deleted' })}
      />
    );
    cy.checkA11y();
    cy.contains('Upload new images').should('be.visible');
    cy.contains('Manage uploaded images').should('be.visible');
  });
});
