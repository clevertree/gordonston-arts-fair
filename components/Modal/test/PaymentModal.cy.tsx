import React from 'react';
import PaymentModal from '../PaymentModal';

describe('<PaymentModal />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <PaymentModal
        open={true}
        title="Payment Required"
        text="Please pay the registration fee"
        onClick={cy.stub()}
        onClose={cy.stub()}
      />
    );
    cy.checkA11y();
    cy.contains('Pay Registration Fee').should('be.visible');
  });
});
