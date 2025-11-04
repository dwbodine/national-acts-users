import 'react-toastify/ReactToastify.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import '../Css/App.css';

import { Open_Sans } from 'next/font/google';
import Providers from '@/components/common/providers';

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  variable: '--font-open-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" href="/images/favicon.png"></link>
      </head>
      <body className={`${openSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
