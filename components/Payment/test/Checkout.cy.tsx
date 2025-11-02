import React from 'react';
import Checkout from '../Checkout';

describe('<Checkout />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <Checkout
        stripePublishableKey="pk_test_123"
        feeType="registration"
        feeText="Registration fee is $50"
        buttonText="Pay Now"
        disabled={false}
      />
    );
    cy.checkA11y();
    cy.contains('Checkout').should('be.visible');
    cy.contains('Pay Now').should('be.visible');
  });
});
