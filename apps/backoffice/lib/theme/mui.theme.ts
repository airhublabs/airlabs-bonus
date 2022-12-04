import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'standard' },
    },
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
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
    allVariants: {
      color: 'var(--color-heading)',
    },
    h1: {
      fontSize: 'var(--text-h1)',
      fontWeight: 400,
    },
    h2: {
      fontSize: 'var(--text-h2)',
      fontWeight: 400,
    },
    h3: {
      fontSize: 'var(--text-h3)',
      fontWeight: 400,
    },
    h4: {
      fontSize: 'var(--text-h4)',
      fontWeight: 400,
    },
    h5: {
      fontSize: 'var(--text-h5)',
      fontWeight: 400,
    },
    h6: {
      fontSize: 'var(--text-h6)',
      fontWeight: 400,
    },
    body1: {
      fontSize: 'var(--text-body)',
      color: 'var(--color-text)',
    },
    body2: {
      color: 'var(--color-text)',
    },
    subtitle1: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text)',
    },
    button: {
      fontSize: 'var(--text-button)',
    },
    fontFamily: 'Noto Sans, sans-serif',
  },
});
