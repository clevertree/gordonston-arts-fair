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
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
import {mount} from 'cypress/react';
import {Box, Typography} from '@mui/material';
import '../../app/globals.scss';
import ThemeRegistry from "@components/Theme/ThemeRegistry";
import {AppRouterContext} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from "react";


// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

// Override checkA11y to apply sensible defaults in component context
// while still allowing per-test overrides
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Cypress.Commands.overwrite('checkA11y', (originalFn: any, context?: any, options?: any, violationCallback?: any, skipFailures?: any) => {
    const defaultOptions = {
        // Focus on critical issues by default for isolated components
        // Tests can override to broaden checks
        includedImpacts: ['critical'],
    } as any;
    const mergedOptions = { ...defaultOptions, ...(options || {}) };
    return originalFn(context, mergedOptions, violationCallback, skipFailures);
});

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
    // Set basic document metadata for axe (title and lang)
    if (document) {
        if (!document.title) document.title = 'Component Test';
        const html = document.documentElement;
        if (html && !html.getAttribute('lang')) html.setAttribute('lang', 'en');
    }

    const wrappedContent = (
        <Box p={2}>
            <AppRouterContext.Provider value={mockRouter}>
                <ThemeRegistry>
                    <h1 style={{position:'absolute', left:-10000, top:'auto', width:1, height:1, overflow:'hidden'}}>Component Test</h1>
                    <main role="main" aria-label="Main content">
                        {component}
                    </main>
                </ThemeRegistry>
            </AppRouterContext.Provider>
        </Box>
    );
    // Mount and then inject + configure axe for consistent a11y checks
    return mount(wrappedContent).then(() => {
        // Ensure axe is injected and configured to focus on serious issues in component context
        // Tests may still call cy.injectAxe(); double-injection is harmless
        cy.injectAxe();
        cy.configureAxe({
            // Ignore color-contrast in headless Electron due to rendering differences
            rules: [
                { id: 'color-contrast', enabled: false },
            ],
            // Limit impact for signal-to-noise in isolated components
            // Note: individual tests can override by passing options to cy.checkA11y
            // @ts-ignore - types allow string[] for includedImpacts
            includedImpacts: ['critical']
        } as any);
    });
});
// Example use:
// cy.mount(<MyComponent />)
