// @ts-ignore
import {UserTableRow} from "@util/schema";

describe('template spec', () => {
    beforeEach(() => {
    });
    // afterEach(() => {
    // });

    it('Navigate site', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.get('h1').should('contain', 'Gordonston');
        cy.checkA11y();

        cy.get('a[href="/dashboard"]').last().click();
        cy.get('h1').should('contain', 'Artist Login');
        cy.checkA11y();

        cy.get('a[href="/login"]').last().click();
        cy.get('h1').should('contain', 'Artist Login');
        cy.get('input[name="email"]').type("test@test.com{enter}")
        // cy.get('button[type="submit"]').click();

        cy.get('a[href="/logout"]').last().click();
        cy.get('button[type="submit"]').click();

        cy.get('a[href="/login"]').last().click();
        cy.get('h1').should('contain', 'Artist Login');
        cy.get('input[name="phone"]').type("1234567890{enter}")


        cy.get('h1').should('contain', 'Artist Dashboard');
        cy.injectAxe();
        cy.checkA11y();


        cy.get('a[href="/profile/edit"]').last().click();
        cy.get('h1').should('contain', 'Edit Artist Profile');


    });
});
