import React from 'react';
import ThemeRegistry from '../ThemeRegistry';

describe('<ThemeRegistry />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <ThemeRegistry>
        <div>Test Content</div>
      </ThemeRegistry>
    );
    cy.checkA11y();
    cy.contains('Test Content').should('be.visible');
  });
});
