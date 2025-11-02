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

        cy.get('button[component="SignInButton"]').last().click();

        // Sign in using Clerk
        cy.origin('https://thorough-elf-16.accounts.dev', () => {
            cy.get('input[name="identifier"]').type('test@test.com');
            cy.get('button').contains('Continue').click();
            cy.get('input[name="password"]').type('ZKsS3XOEDjEIWFmL');
            cy.get('button').contains('Continue').click();
        });

        // Verify logged in state
        cy.contains('test@test.com').should('be.visible');

        cy.get('h1').should('contain', 'Artist Profile');
        cy.injectAxe();
        cy.checkA11y();

        cy.get('a[href="/profile/edit"]').last().click();
        cy.get('h1').should('contain', 'Edit Artist Profile');

        cy.get('a[href="/profile/upload"]').last().click();
        cy.get('h1').should('contain', 'Upload Artist Images');
    });
});
