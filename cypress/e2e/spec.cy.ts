// @ts-ignore
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

        cy.get('a[href="/profile"]').last().click();
        cy.get('h1').should('contain', 'Artist Login');
        cy.checkA11y();

        cy.get('a[href="/register"]').last().click();
        cy.get('h1').should('contain', 'Artist Registration');
        cy.checkA11y();

        cy.get('a[href="/password"]').last().click();
        cy.get('h1').should('contain', 'Password Reset');
        cy.checkA11y();

        // cy.get('a[href="/register"]').last().click();
        // cy.get('input[name="email"]').type("test@example.com")
        // cy.get('input[name="password"]').type("password")
        // cy.get('button[type="submit"]').click();

        cy.get('a[href="/login"]').last().click();
        cy.get('input[name="email"]').type("test@example.com")
        cy.get('input[name="password"]').type("password")
        cy.get('button[type="submit"]').click();

        cy.get('h1').should('contain', 'Artist Profile');
        cy.injectAxe();
        cy.checkA11y();

    });
});
