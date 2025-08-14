"use client";

import { UserActivityType } from '@/types/user';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useLogout } from '@/hooks/user/useLogout';
import { useResetStores } from '@/hooks/common/useResetStores';

export default function LogoutComponent() {
  const { logout } = useLogout();
  const { logActivityData } = useLogActivityData();
  const { resetStores } = useResetStores();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logActivityData(UserActivityType.Logout).then(() => {
        resetStores();
        logout().then(() => {
          redirect('/login/');
        });
      });
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [logActivityData, logout, resetStores]);

  return '';
}
