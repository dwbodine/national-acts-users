import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '../src/lib/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <ToastContainer />
    </>
  );
}
