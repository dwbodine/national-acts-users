'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'rsuite';

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
