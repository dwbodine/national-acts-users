'use client';

import { ReactNode } from 'react';

import Frame from '@/components/common/Frame/Frame';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Frame>{children}</Frame>;
}
