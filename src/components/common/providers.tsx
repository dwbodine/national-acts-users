'use client';

import { CustomProvider } from 'rsuite';
import Frame from '@/components/Frame';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { appNavs } from '../../config';
import enUS from 'rsuite/locales/en_US';
import locales from '@/locales';
import { store } from '@/lib/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <IntlProvider locale="en" messages={locales.en}>
        <CustomProvider locale={enUS}>
          <Frame navs={appNavs}>{children}</Frame>
        </CustomProvider>
      </IntlProvider>
      <ToastContainer />
    </Provider>
  );
}
