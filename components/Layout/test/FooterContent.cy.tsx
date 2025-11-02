import React from 'react';
import { FooterContent } from '../FooterContent';

describe('<FooterContent />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(<FooterContent />);
    cy.checkA11y();
    cy.contains('Privacy Policy').should('be.visible');
  });
});
