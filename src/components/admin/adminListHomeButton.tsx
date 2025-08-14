"use client";

import { Button } from 'react-bootstrap';
import { redirect } from 'next/navigation';

export default function AdminListHomeButton() {
  const goHome = () => {
    redirect('/admin/');
  };
  return <Button className="admin-home-button" onClick={goHome}>Back</Button>;
}
