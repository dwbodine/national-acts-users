'use client';

import Link from 'next/link';
import React from 'react';
import { JSX } from 'react/jsx-runtime';
import { Stack, StackProps } from 'rsuite';
import { WithAsProps } from 'rsuite/esm/internals/types';
import { Omit } from 'rsuite/esm/internals/types/utils';

import Logo from './Logo';

const Brand = (
  props: JSX.IntrinsicAttributes &
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      WithAsProps<'div'> & StackProps
    > &
    WithAsProps<'div'> &
    StackProps & { children?: React.ReactNode | undefined } & {
      expanded: boolean;
    },
) => {
  const { expanded, ...rest } = props;
  return (
    <Stack className="brand" {...rest}>
      <Link href="/" style={{ textAlign: 'center' }}>
        <Logo height={expanded ? 77 : 35} width={expanded ? 100 : 35} expanded={expanded} />
      </Link>
    </Stack>
  );
};

export default Brand;
