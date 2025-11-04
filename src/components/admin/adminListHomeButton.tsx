'use client';

import { Button } from 'rsuite';
import { useRouter } from 'next/navigation';

export default function AdminListHomeButton() {
  const router = useRouter();
  const goHome = () => {
    router.push('/admin');
  };
  return (
    <Button className="admin-home-button" onClick={goHome}>
      Back
    </Button>
  );
}
