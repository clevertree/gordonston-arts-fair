// @ts-ignore
describe('template spec', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.injectAxe();
    });
    afterEach(() => {
        cy.checkA11y();
    });

    it('Navigate site', () => {
    });
});
