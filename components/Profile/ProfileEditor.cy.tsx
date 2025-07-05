import React from 'react';
import ProfileEditor from '@components/Profile/ProfileEditor';
import { UserTableRow } from '@util/schema';

describe('<ProfileEditor />', () => {
  const userProfile: UserTableRow = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    type: 'admin',
    status: 'submitted'
  };
  beforeEach(() => {
    cy.viewport(1080, 1080);
    cy.injectAxe();
  });
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount((
      <ProfileEditor
        userProfile={userProfile}
        updateProfile={cy.stub()}
        uploadFile={cy.stub()}
        deleteFile={cy.stub()}
      />));
    cy.checkA11y();

    // cy.get('div').should('contain', 'First Name is a required field');
    cy.get('input[name="first_name"]').type('First');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'Last Name is a required field');
    cy.get('input[name="last_name"]').type('Last');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'Primary Phone is a required field');
    cy.get('input[name="phone"]').type('1234');
    cy.get('button[type="submit"]').click();
    cy.get('div').should('contain', 'Please enter a valid Primary Phone');
    cy.get('input[name="phone"]').type('1234342345');
    cy.get('input[name="phone2"]').type('1234342345');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'Address is a required field');
    cy.get('input[name="address"]').type('Address');
    cy.get('input[name="city"]').type('City');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'State is a required field');
    cy.get('[name="state"]').parent().click();
    cy.get('li[role="option"]').contains('Georgia').click();

    cy.get('button[type="submit"]').click();
    cy.get('div').should('contain', 'Zipcode is a required field');
    cy.get('input[name="zipcode"]').type('abcde');
    cy.get('button[type="submit"]').click();
    cy.get('div').should('contain', 'Please enter a valid Zipcode');
    cy.get('input[name="zipcode"]').clear();
    cy.get('input[name="zipcode"]').type('31404');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'Category is a required field');
    cy.get('[name="category"]').parent().click();
    cy.get('li[role="option"]').contains('Painting').click();
    cy.get('textarea[name="description"]').type('Description');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'User profile updated successfully');
  });
});
