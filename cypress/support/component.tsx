// ***********************************************************
// This example support/component.tsx is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import 'cypress-axe';

// Import commands.js using ES2015 syntax:
import './commands.ts';

// Alternatively you can use CommonJS syntax:
// require('./commands')
import {mount} from 'cypress/react';
import {Box} from '@mui/material';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {StyledEngineProvider} from '@mui/material/styles';
// import ThemeProvider from '@provider/themeProvider';
import '../../app/globals.scss';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

Cypress.Commands.add('mount', (component) => {
    const wrappedContent = (
        <Box p={2}>
            <AppRouterCacheProvider options={{enableCssLayer: true}}>
                <StyledEngineProvider injectFirst>
                    {/*<ThemeProvider>*/}
                    {component}
                    {/*</ThemeProvider>*/}
                </StyledEngineProvider>
            </AppRouterCacheProvider>
        </Box>
    );
    return mount(wrappedContent);
});
// Example use:
// cy.mount(<MyComponent />)
