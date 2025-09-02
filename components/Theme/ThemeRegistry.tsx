'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'; // Adjust version if needed
import theme from './theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      {/* <StyledEngineProvider injectFirst> */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* <CssBaseline /> */}
        {children}
      </ThemeProvider>
      {/* </StyledEngineProvider> */}
    </AppRouterCacheProvider>
  );
}
