'use client';

import { CustomProvider } from 'rsuite';
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { ToastContainer } from 'react-toastify';
import { store } from '@/lib/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
      <Provider store={store}>
        <CustomProvider>
          {children}
        </CustomProvider>
        <ToastContainer />
      </Provider> 
  );
}