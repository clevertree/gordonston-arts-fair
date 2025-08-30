import React from 'react';
import ProfileEditor from '@components/User/ProfileEditor';
import { UserModel } from '@util/models';

describe('<ProfileEditor />', () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    cy.injectAxe();
  });
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount((
      <ProfileEditorWrapper />));
    cy.checkA11y();

    // cy.get('div').should('contain', 'First Name is a required field');
    cy.focused().should('have.attr', 'name', 'first_name');
    cy.get('input[name="first_name"]').type('First{enter}');
    cy.get('button[type="submit"]').click();

    cy.focused().should('have.attr', 'name', 'last_name');
    cy.get('div').should('contain', 'Last Name is a required field');
    cy.get('input[name="last_name"]').type('Last{enter}');
    cy.get('button[type="submit"]').click();

    cy.focused().should('have.attr', 'name', 'email');
    cy.get('div').should('contain', 'Email is a required field');
    cy.get('input[name="email"]').type('test@test.com{enter}');
    cy.get('button[type="submit"]').click();

    cy.focused().should('have.attr', 'name', 'phone');
    cy.get('div').should('contain', 'Primary Phone is a required field');
    cy.get('input[name="phone"]').type('1234{enter}');
    cy.get('button[type="submit"]').click();
    cy.get('div').should('contain', 'Please enter a valid Primary Phone');
    cy.get('input[name="phone"]').clear();
    cy.get('input[name="phone"]').type('1234342345{enter}');
    // cy.get('input[name="phone2"]').type('1234342345{enter}');
    cy.get('button[type="submit"]').click();

    cy.focused().should('have.attr', 'name', 'address');
    cy.get('div').should('contain', 'Address is a required field');
    cy.get('input[name="address"]').type('Address{enter}');
    cy.get('input[name="city"]').type('City{enter}');
    cy.get('button[type="submit"]').click();

    cy.focused().next().should('have.attr', 'name', 'state'); // Hack for MUISelects
    cy.get('div').should('contain', 'State is a required field');
    cy.get('[name="state"]').parent().click();
    cy.get('li[role="option"]').contains('Georgia').click();
    cy.get('button[type="submit"]').click();

    cy.focused().should('have.attr', 'name', 'zipcode');
    cy.get('div').should('contain', 'Zipcode is a required field');
    cy.get('input[name="zipcode"]').type('abcde');
    cy.get('button[type="submit"]').click();
    cy.get('div').should('contain', 'Please enter a valid Zipcode');
    cy.get('input[name="zipcode"]').clear();
    cy.get('input[name="zipcode"]').type('31404');
    cy.get('button[type="submit"]').click();

    cy.focused().next().should('have.attr', 'name', 'category'); // Hack for MUISelects
    cy.get('div').should('contain', 'Category is a required field');
    cy.get('[name="category"]').parent().click();
    cy.get('li[role="option"]').contains('Painting').click();
    cy.get('textarea[name="description"]').type('Description');
    cy.get('button[type="submit"]').click();

    cy.get('div').should('contain', 'Please upload at least one image of your artwork to complete your profile.');
  });
});

function ProfileEditorWrapper() {
  const [userProfile, setUserProfile] = React.useState<UserModel>(() => ({
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
    status: 'submitted',
    uploads: {}
  } as UserModel));
  return (
    <ProfileEditor
      userProfile={userProfile}
      updateProfile={async (p) => {
        setUserProfile(p);
        return p;
      }}
      uploadFile={cy.stub()}
      deleteFile={cy.stub()}
    />
  );
}
