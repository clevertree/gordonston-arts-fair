import React from 'react';
import UserListAdmin from '../UserListAdmin';

describe('<UserListAdmin />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <UserListAdmin
        listUsersAsAdmin={cy.stub().resolves({
          userList: [],
          pageCount: 1,
          totalCount: 0
        })}
      />
    );
    cy.checkA11y();
    cy.contains('Management').should('be.visible');
  });
});
