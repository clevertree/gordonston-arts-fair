import React from 'react';
import ReloadingImage from '../ReloadingImage';

describe('<ReloadingImage />', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('renders', () => {
    cy.mount(
      <ReloadingImage
        src="/test-image.jpg"
        alt="Test Image"
        width={100}
        height={100}
      />
    );
    cy.checkA11y();
  });
});
