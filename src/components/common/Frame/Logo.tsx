'use client';

import Image from 'next/image';
import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ width, height, className = '' }: LogoProps) {
  return (
    <div
      className={`rsuite-logo logo-animated logo-animated-delay-half-seconds bounce-in ${className} `}
    >
      <Image
        alt="National Acts"
        src="/images/logo-new.png"
        width={width}
        height={height}
      />
    </div>
  );
}
