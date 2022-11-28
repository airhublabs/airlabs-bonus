import { AppProps } from 'next/app';
import Head from 'next/head';
import '../lib/styles/reset.css';
import '../lib/styles/root.scss';
import '../lib/styles/global.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to backoffice!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
