'use client';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/lib/globalSelectionSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getUser } = useCurrentUser();

  useEffect(() => {
    const user = getUser();

    if (user && user.isAuthenticated) {
      dispatch(setCurrentUser(user));
      if (user.isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/sellers');
      }
    }
  }, [router, getUser]);

  return <></>;
}
