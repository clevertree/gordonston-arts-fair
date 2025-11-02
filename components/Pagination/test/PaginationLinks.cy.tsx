import React from 'react';
import { PaginationLinks } from '../PaginationLinks';

describe('<PaginationLinks />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <PaginationLinks
        page={1}
        pageCount={5}
        setPage={cy.stub()}
      />
    );
    cy.checkA11y();
    cy.contains('Previous').should('be.visible');
    cy.contains('Next').should('be.visible');
  });
});
