import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
// eslint-disable-next-line camelcase
import { Open_Sans } from "next/font/google";
import Providers from '@/components/common/providers';

// eslint-disable-next-line new-cap
const openSans = Open_Sans({
  subsets: ["latin-ext"],
  variable: "--font-open-sans",  
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
         <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" href="/images/favicon.png"></link>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
        />
      </head> 
      <body className={`${openSans.variable}`}>
        <Providers>{children}</Providers>    
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}
