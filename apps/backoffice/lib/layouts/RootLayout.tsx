import { ThemeProvider } from '@mui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { FC, PropsWithChildren } from 'react';
import { theme } from '../theme/mui.theme';

/* RootLayout is used to handle logic needed on every page, IE. Query Client, Redux, etc. */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootLayoutProps extends PropsWithChildren {}

const RootLayout: FC<RootLayoutProps> = (props) => {
  const queryClient = new QueryClient();

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider autoHideDuration={4000} resumeHideDuration={10} maxSnack={3}>
          <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
