'use client';

import { adminAppNavs, userAppNavs } from '../../config';
import { ReactNode, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRouter } from 'next/navigation';
import Frame from '@/components/Frame';
import { NavItemData } from '@/components/Frame/Frame';

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }

    if (user && user.isAuthenticated) {
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin);
    }
  }, [router, getUser, user]);

  let appNavs: NavItemData[] = [];
  if (isAuthenticated) {
    if (isAdmin) {
      appNavs = adminAppNavs;
    } else {
      appNavs = userAppNavs;
    }
  }

  return <Frame navs={appNavs}>{children}</Frame>;
}
