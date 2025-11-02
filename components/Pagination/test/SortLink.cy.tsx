import React from 'react';
import { SortLink } from '../SortLink';

describe('<SortLink />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <SortLink
        variable="name"
        title="Name"
        args={{ orderBy: 'name', order: 'asc' }}
      />
    );
    cy.checkA11y();
    cy.contains('Name').should('be.visible');
  });
});
