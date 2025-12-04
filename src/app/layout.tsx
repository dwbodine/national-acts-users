// vendor styles
import 'react-toastify/ReactToastify.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
// base styles
import '../Css/App.css';
import '../Css/Admin.css';
import '../Css/Auth.css';
// frame styles
import '../Css/Brand.css';
import '../Css/Frame.css';
import '../Css/Header.css';
import '../Css/Logo.css';
// common controls
import '../Css/PageHeader.css';
import '../Css/SelectControls.css';
import '../Css/CheckboxControls.css';
import '../Css/Tables.css';
import '../Css/Widgets.css';
// section styles
import '../Css/Dashboard.css';
import '../Css/Sales.css';
// print styles
import '../Css/Print.css';

import Providers from '@/components/common/Frame/providers';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" href="/images/favicon.png"></link>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
