"use client";

import { Button } from 'react-bootstrap';
import { redirect } from 'next/navigation';

export default function ReportsListHomeButton() {
  const goHome = () => {
    redirect('/reports/');
  };
  return <Button onClick={goHome}>Back</Button>;
}
