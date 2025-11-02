import React from 'react';
import UploadsModal from '../UploadsModal';

describe('<UploadsModal />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <UploadsModal
        open={true}
        onClick={cy.stub()}
        onClose={cy.stub()}
      />
    );
    cy.checkA11y();
    cy.contains('Please upload artwork').should('be.visible');
  });
});
