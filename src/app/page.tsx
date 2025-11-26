'use client';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { getUser } = useCurrentUser();

  useEffect(() => {
    const user = getUser();

    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/sellers');
      }
    }
  }, [router, getUser]);

  return <></>;
}
