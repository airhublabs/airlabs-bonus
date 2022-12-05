import { NextPageWithLayout } from 'apps/backoffice/pages/_app';
import React, { createContext, FC, Key, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/system';
import { theme } from '../theme/mui.theme';
import AlertContainer from '../components/global/AlertContainer';
import { Alert, Snackbar } from '@mui/material';
import { useAlerts } from '../hooks/useAlerts';
import { SnackbarProvider } from 'notistack';

/* RootLayout is used to handle logic needed on every page, IE. Query Client, Redux, etc. */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootLayoutProps extends PropsWithChildren {}

const RootLayout: FC<RootLayoutProps> = (props) => {
  const queryClient = new QueryClient();
  const alert = useAlerts();

  console.log(alert);

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>

      <AlertContainer xLocation="right" />
    </>
  );
};

export default RootLayout;
