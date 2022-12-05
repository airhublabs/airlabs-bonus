import { AppProps } from 'next/app';
import Head from 'next/head';
import '../lib/styles/reset.css';
import '../lib/styles/root.scss';
import '../lib/styles/global.scss';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import RootLayout from '../lib/layouts/RootLayout';
import DashboardLayout from '../lib/layouts/DashboardLayout';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getPageLayout =
    Component.getLayout ?? ((page) => <DashboardLayout> {page}</DashboardLayout>);

  return getPageLayout(
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <title>Airlabs Backoffice</title>
      </Head>

      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  );
}

export default App;
