import React from 'react';
import { ClerkSessionContent } from '../ClerkSessionContent';
import { ClerkProvider } from '@clerk/nextjs';

describe('<ClerkSessionContent />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <ClerkProvider>
        <ClerkSessionContent />
      </ClerkProvider>
    );
    cy.checkA11y();
  });
});
