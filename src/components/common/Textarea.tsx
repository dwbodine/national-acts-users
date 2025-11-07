'use client';

import { Input, type InputProps } from 'rsuite';
import React from 'react';

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> &
  InputProps;

const Textarea: React.FC<TextareaProps> = (props) => {
  return <Input as="textarea" {...props} />;
};

export default Textarea;
