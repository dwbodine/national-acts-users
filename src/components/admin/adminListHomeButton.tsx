"use client";

import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function AdminListHomeButton() {
  const router = useRouter();
  const goHome = () => {
    router.push('/admin/');
  };
  return <Button className="admin-home-button" onClick={goHome}>Back</Button>;
}
