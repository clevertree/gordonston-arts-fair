import React from 'react';
import UserStatusEditorAdmin from '../UserStatusEditorAdmin';

describe('<UserStatusEditorAdmin />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <UserStatusEditorAdmin
        userStatus="submitted"
        updateUserStatus={cy.stub().resolves({ message: 'Status updated' })}
      />
    );
    cy.checkA11y();
    cy.contains('Manage').should('be.visible');
    cy.contains('Update Status').should('be.visible');
  });
});
