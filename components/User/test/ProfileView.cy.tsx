import React from 'react';
import ProfileView from '../ProfileView';
import { UserModel } from '@util/models';

describe('<ProfileView />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    const mockUser: Partial<UserModel> = {
      id: 1,
      email: 'test@test.com',
      first_name: 'Test',
      last_name: 'User',
      status: 'registered',
      uploads: []
    };

    cy.mount(
      <ProfileView
        userProfile={mockUser as UserModel}
        userUploads={[]}
      />
    );
    cy.checkA11y();
    cy.contains('Contact Information').should('be.visible');
    cy.contains('Uploaded files').should('be.visible');
  });
});
