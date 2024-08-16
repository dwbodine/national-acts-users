import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import CheckAuth from '../components/common/checkAuthComponent';
 
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" href="/images/favicon.png"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
          />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></Script>
      </body>
    </Html>
  )
}