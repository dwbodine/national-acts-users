'use client';

import { Stack, StackProps } from 'rsuite';
import { JSX } from 'react/jsx-runtime';
import Link from 'next/link';
import Logo from './Logo';
import { Omit } from 'rsuite/esm/internals/types/utils';
import React from 'react';
import { WithAsProps } from 'rsuite/esm/internals/types';

const Brand = (
  props: JSX.IntrinsicAttributes &
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      WithAsProps<'div'> & StackProps
    > &
    WithAsProps<'div'> &
    StackProps & { children?: React.ReactNode | undefined },
) => (
  <Stack className="brand" {...props}>
    <Logo height={26} style={{ marginTop: 6 }} />
    <Link href="/" style={{ marginLeft: 14 }}>
      Admin Template
    </Link>
  </Stack>
);

export default Brand;
