'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function Admin() {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  useEffect(() => {
    const user = getUser();

    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        void router.push('/dashboard');
      } else {
        void router.push('/sellers');
      }
    } else {
      void router.push('/logout');
    }
  }, [router, getUser]);

  return <></>;
}
