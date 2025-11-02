import React from 'react';
import { SuspenseContent } from '../SuspenseContent';

describe('<SuspenseContent />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(<SuspenseContent />);
    cy.checkA11y();
    cy.get('[aria-label="loading"]').should('be.visible');
  });
});
