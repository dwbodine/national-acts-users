'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'rsuite';

export default function ReportsListHomeButton() {
  const router = useRouter();

  const goHome = () => {
    router.push('/reports');
  };
  return <Button onClick={goHome}>Back</Button>;
}
