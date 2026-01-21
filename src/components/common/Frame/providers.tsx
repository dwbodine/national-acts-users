'use client';

import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { CustomProvider } from 'rsuite';
import enUS from 'rsuite/locales/en_US';

import { store } from '@/lib/store';
import locales from '@/locales';

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
