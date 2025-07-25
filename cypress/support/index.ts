// ***********************************************************
// This example support/e2e.ts is processed and
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
// eslint-disable-next-line import/no-extraneous-dependencies
import {MountReturn} from "cypress/react";

declare global {
    namespace Cypress {
        interface Chainable {
            mount(component: any): Cypress.Chainable<MountReturn>
        }
    }
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
// failOnConsoleError({
//     debug: true,
//     consoleTypes: ['error', 'warn']
// });
