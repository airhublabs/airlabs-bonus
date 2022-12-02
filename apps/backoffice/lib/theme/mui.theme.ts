import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
          ':hover': { boxShadow: 'none' },
        },
        root: {
          borderRadius: 2,
          textTransform: 'none',
        },
        sizeMedium: {
          height: '35px',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#D48424',
      contrastText: 'white',
    },
  },
  typography: {
    h1: {
      fontSize: 'var(--text-h1)',
    },
    h2: {
      fontSize: 'var(--text-h2)',
    },
    h3: {
      fontSize: 'var(--text-h3)',
    },
    h4: {
      fontSize: 'var(--text-h4)',
    },
    h5: {
      fontSize: 'var(--text-h5)',
    },
    h6: {
      fontSize: 'var(--text-h6)',
    },
    body1: {
      fontSize: 'var(--text-body)',
    },
    subtitle1: {
      fontSize: 'var(--text-sm)',
    },
    button: {
      fontSize: 'var(--text-button)',
    },
    fontFamily: 'Noto Sans, sans-serif',
  },
});
