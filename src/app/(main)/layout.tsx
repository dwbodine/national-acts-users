'use client';

import Frame from '@/components/Frame';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Frame>{children}</Frame>;
}
