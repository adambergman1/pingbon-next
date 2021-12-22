import '../styles/main.scss';
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layouts/Layout';
import ProgressBar from '../components/ProgressBar';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
      </Head>
      <Layout>
        <ProgressBar />
        <Component {...pageProps} key={router.asPath} />
      </Layout>
    </>
  );
}

export default MyApp;
