import React from 'react';
import { SortLinks } from '../SortLinks';

describe('<SortLinks />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <SortLinks
        fieldList={['name', 'email', 'date']}
        args={{ orderBy: 'name', order: 'asc' }}
      />
    );
    cy.checkA11y();
    cy.contains('Name').should('be.visible');
    cy.contains('Ascending').should('be.visible');
  });
});
