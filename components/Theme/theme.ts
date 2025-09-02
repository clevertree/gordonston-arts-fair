'use client';

// components/ThemeRegistry/theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    'x-small': true;
  }
}

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

const theme = createTheme({
  typography: {
    // fontFamily: roboto.style.fontFamily,
  },
  // palette: {
  //   mode: 'light', // or 'dark'
  //   primary: {
  //     main: '#1976d2',
  //   },
  // },
  components: {
    MuiButton: {
      variants: [
        {
          props: { size: 'x-small' },
          style: {
            textTransform: 'none',
            fontSize: '8px',
            padding: '2px 8px',
          },
        },
      ],
    }
  }
});

export default theme;
