'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useResetStores } from '@/hooks/common/useResetStores';
import { useLogout } from '@/hooks/user/useLogout';
import { UserActivityType } from '@/types/user';

export default function LogoutComponent() {
  const router = useRouter();
  const { logout } = useLogout();
  const { logActivityData } = useLogActivityData();
  const { resetStores } = useResetStores();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const err = searchParams.get('err');
      void logActivityData(UserActivityType.Logout).then(() => {
        resetStores();
        void logout().then(() => {
          let loginUrl = '/login';
          if (err) {
            loginUrl += `?err=${err}`;
          }
          router.push(loginUrl);
        });
      });
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [logActivityData, logout, resetStores, router]);

  return '';
}
