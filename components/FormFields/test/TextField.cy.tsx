import React from 'react';
import TextField from '../TextField';

describe('<TextField />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <TextField
        name="test"
        label="Test Field"
        value=""
        onChange={cy.stub()}
      />
    );
    cy.checkA11y();
    cy.get('input[name="test"]').should('be.visible');
  });
});
