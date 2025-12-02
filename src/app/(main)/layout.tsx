'use client';

import Frame from '@/components/common/Frame/Frame';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Frame>{children}</Frame>;
}
