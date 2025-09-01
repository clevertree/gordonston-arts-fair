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
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Import commands.js using ES2015 syntax:
import './commands';

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
// Mock Next.js App Router for component testing
    const mockRouter = {
        push: cy.stub().as('routerPush'),
        replace: cy.stub().as('routerReplace'),
        prefetch: cy.stub().as('routerPrefetch'),
        back: cy.stub().as('routerBack'),
        forward: cy.stub().as('routerForward'),
        refresh: cy.stub().as('routerRefresh'),
        pathname: '/profile',
        searchParams: new URLSearchParams(),
        query: {},
    };
    const wrappedContent = (
        <Box p={2}>
            <AppRouterContext.Provider value={mockRouter}>
            <AppRouterCacheProvider options={{enableCssLayer: true}}>
                <StyledEngineProvider injectFirst>
                    {/*<ThemeProvider>*/}
                    {component}
                    {/*</ThemeProvider>*/}
                </StyledEngineProvider>
            </AppRouterCacheProvider>
            </AppRouterContext.Provider>
        </Box>
    );
    return mount(wrappedContent);
});
// Example use:
// cy.mount(<MyComponent />)
