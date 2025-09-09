"use client";

import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function ReportsListHomeButton() {
  const router = useRouter();

  const goHome = () => {
    router.push('/reports/');
  };
  return <Button onClick={goHome}>Back</Button>;
}
