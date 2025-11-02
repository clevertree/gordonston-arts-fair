import React from 'react';
import {MenuItem} from '@mui/material';
import SelectField from '../SelectField';

describe('<SelectField />', () => {
    beforeEach(() => {
        cy.injectAxe();
    });
    it('renders', () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount((
            <SelectField
                name="test"
                label="TEST"
                onBlur={cy.stub()}
                value="Item1"
                scrollIntoView
            >
                <MenuItem>Item1</MenuItem>
                <MenuItem>Item2</MenuItem>
            </SelectField>));
        cy.checkA11y();
    });
});
