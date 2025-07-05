// @ts-ignore
import {UserTableRow} from "@util/schema";

describe('template spec', () => {
    beforeEach(() => {
    });
    // afterEach(() => {
    // });

    it('Navigate site', () => {
        cy.visit('/test/reset');
        cy.get('button[type="submit"]').click();
        
        cy.visit('/');
        cy.injectAxe();
        cy.get('h1').should('contain', 'Gordonston');
        cy.checkA11y();

        cy.get('a[href="/profile"]').last().click();
        cy.get('h1').should('contain', 'Artist Login');
        cy.checkA11y();

        cy.get('a[href="/register"]').last().click();
        cy.get('h1').should('contain', 'Artist Registration');
        cy.checkA11y();

        cy.get('a[href="/password"]').last().click();
        cy.get('h1').should('contain', 'Password Reset');
        cy.checkA11y();

        cy.get('a[href="/register"]').last().click();
        // cy.get('input[name="first_name"]').type("First");
        // cy.get('input[name="last_name"]').type("Last");
        cy.get('input[name="email"]').type("test@test.com")
        cy.get('input[name="password"]').type("password")
        cy.get('button[type="submit"]').click();

        // cy.get('a[href="/login"]').last().click();
        // cy.get('input[name="email"]').type("test@test.com")
        // cy.get('input[name="password"]').type("password")
        // cy.get('button[type="submit"]').click();

        cy.get('h1').should('contain', 'Artist Profile');
        cy.injectAxe();
        cy.checkA11y();

        cy.get('input[name="phone2"]').type("123");
        cy.get('button[type="submit"]').click();

        cy.get('div').should('contain', 'First Name is a required field');
        cy.get('input[name="first_name"]').type("First");
        cy.get('button[type="submit"]').click();

        cy.get('div').should('contain', 'Last Name is a required field');
        cy.get('input[name="last_name"]').type("Last");
        cy.get('button[type="submit"]').click();

        cy.get('div').should('contain', 'Primary Phone is a required field');
        cy.get('input[name="phone"]').type("1234");
        cy.get('button[type="submit"]').click();
        cy.get('div').should('contain', 'Please enter a valid Primary Phone');
        cy.get('input[name="phone"]').type("1234342345");
        cy.get('input[name="phone2"]').type("1234342345");
        cy.get('button[type="submit"]').click();


        cy.get('div').should('contain', 'Address is a required field');
        cy.get('input[name="address"]').type("Address");
        cy.get('input[name="city"]').type("City");
        cy.get('button[type="submit"]').click();

        cy.get('div').should('contain', 'State is a required field');
        cy.get('[name="state"]').parent().click();
        cy.get('li[role="option"]').contains("Georgia").click();

        cy.get('button[type="submit"]').click();
        cy.get('div').should('contain', 'Zipcode is a required field');
        cy.get('input[name="zipcode"]').type("abcde");
        cy.get('button[type="submit"]').click();
        cy.get('div').should('contain', 'Please enter a valid Zipcode');
        cy.get('input[name="zipcode"]').clear().type("31404");
        cy.get('button[type="submit"]').click();


        cy.get('div').should('contain', 'Category is a required field');
        cy.get('[name="category"]').parent().click();
        cy.get('li[role="option"]').contains("Painting").click();
        cy.get('textarea[name="description"]').type("Description")
        cy.get('button[type="submit"]').click();

        cy.get('div').should('contain', 'User profile updated successfully');

        cy.visit('/test/reset');

    });
});
