import React from 'react';
import FloatingDiv from '../FloatingDiv';

describe('<FloatingDiv />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <FloatingDiv>
        <div>Test Content</div>
      </FloatingDiv>
    );
    cy.checkA11y();
    cy.contains('Test Content').should('be.visible');
  });
});
