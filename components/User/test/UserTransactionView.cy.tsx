import React from 'react';
import UserTransactionView from '../UserTransactionView';

describe('<UserTransactionView />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <UserTransactionView
        fetchUserTransactions={cy.stub().resolves([])}
        title="Transaction History"
      />
    );
    cy.checkA11y();
    cy.contains('Transaction History').should('be.visible');
  });
});
