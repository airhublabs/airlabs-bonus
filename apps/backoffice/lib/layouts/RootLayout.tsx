import { NextPageWithLayout } from 'apps/backoffice/pages/_app';
import React, { FC, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

/* RootLayout is used to handle logic needed on every page, IE. Query Client, Redux, etc. */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootLayoutProps extends PropsWithChildren {}

const RootLayout: FC<RootLayoutProps> = (props) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </>
  );
};

export default RootLayout;
