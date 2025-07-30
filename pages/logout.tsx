import { UserActivityType } from '@/types/user';
import { useEffect } from 'react';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useLogout } from '@/hooks/user/useLogout';
import { useResetStores } from '@/hooks/common/useResetStores';
import { useRouter } from 'next/router';

export default function Logout() {
  const { logout } = useLogout();
  const router = useRouter();
  const { logActivityData } = useLogActivityData();
  const { resetStores } = useResetStores();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logActivityData(UserActivityType.Logout).then(() => {
        resetStores();
        logout().then(() => {
          router.push('/login/');
        });
      });
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [logActivityData, logout, resetStores, router]);

  return '';
}
