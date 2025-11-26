'use client';

import { CustomProvider } from 'rsuite';
import { IntlProvider } from 'react-intl';
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import enUS from 'rsuite/locales/en_US';
import locales from '@/locales';
import { store } from '@/lib/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <IntlProvider locale="en" messages={locales.en}>
        <CustomProvider locale={enUS}>{children}</CustomProvider>
      </IntlProvider>
      <ToastContainer />
    </ReduxProvider>
  );
}
