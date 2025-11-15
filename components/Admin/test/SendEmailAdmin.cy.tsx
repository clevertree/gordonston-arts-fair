import React from 'react';
import SendEmailAdmin from '../SendEmailAdmin';
import {UserModel} from '@util/models';

describe('<SendEmailAdmin />', () => {
    beforeEach(() => {
        cy.injectAxe();
    });

    it('renders', () => {
        const mockUser: Partial<UserModel> = {
            id: 1,
            email: 'test@test.com',
            status: 'submitted'
        };

        cy.mount(
            <SendEmailAdmin
                sendMail={cy.stub().resolves({status: 'success', message: 'Email sent'})}
                userProfile={mockUser as UserModel}
            />
        );
        cy.checkA11y();
        cy.contains('Send batched emails').should('be.visible');
    });
});
