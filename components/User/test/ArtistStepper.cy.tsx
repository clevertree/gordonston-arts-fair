import React from 'react';
import { ArtistStepper } from '../ArtistStepper';

describe('<ArtistStepper />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ArtistStepper
      profileStatus={{
        status: 'registered',
        message: 'Stepper',
        complete: true,
        formFilled: true,
        action: 'upload-files'
      }}
             />);
  });
});
