'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { LogoProps } from '@/types/props';

export default function Logo({ width, height, expanded }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) {
      return;
    }

    // Remove animation class to reset it
    logoRef.current.classList.remove('bounce-in');

    // Trigger reflow to restart animation
    void logoRef.current.offsetWidth;

    // Add the animation class back
    logoRef.current.classList.add('bounce-in');
  }, [expanded]);

  return (
    <div
      ref={logoRef}
      className={`rsuite-logo logo-animated ${expanded ? 'logo-anim-expanded' : 'logo-anim-collapsed'} bounce-in`}
    >
      <Image
        alt="National Acts"
        title="National Acts"
        src={expanded ? '/images/logo-new.png' : '/images/logo-icon.jpg'}
        width={width}
        height={height}
      />
    </div>
  );
}
