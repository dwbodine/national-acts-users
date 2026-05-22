'use client';

import Image from 'next/image';
import { RingLoader } from 'react-spinners';

export default function WaitSpinner({ isLoading }: { isLoading?: boolean }) {
  // If no isLoading is passed, assume "true" (Suspense fallback mode)
  const active = isLoading ?? true;

  if (!active) return null;

  return (
    <div className="waitspinner-overlay">
      <div className="waitspinner-content">
        <Image
          src="/images/logo-new.png"
          alt="National Acts"
          width={120}
          height={90}
          className="waitspinner-logo"
        />
        <div className="waitspinner-spinner-box">
          <RingLoader size={150} color="var(--spinner-color)" />
        </div>
        <div className="waitspinner-label">Loading…</div>
      </div>
    </div>
  );
}
