'use client';

import { Input, type InputProps } from 'rsuite';
import React from 'react';

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value' | 'defaultValue'
> &
  Pick<
    InputProps,
    'onChange' | 'value' | 'defaultValue' | 'disabled' | 'id' | 'className'
  > & {
    rows?: number;
  };

const Textarea: React.FC<TextareaProps> = ({ rows = 3, ...props }) => {
  return <Input as="textarea" rows={rows} {...props} />;
};

export default Textarea;
