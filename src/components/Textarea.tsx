'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from 'rsuite';
import React from 'react';

const Textarea = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

export default Textarea;
