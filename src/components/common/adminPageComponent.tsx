'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'rsuite';

import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { RootState } from '@/lib/store';
import { AdminPageProps } from '@/types/props';
import { User } from '@/types/user';

export default function AdminPage({ Title, UserActivity, children }: AdminPageProps) {
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { logActivityData } = useLogActivityData();
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSettings;
  const router = useRouter();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!user) {
        const currentUser = getUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } else {
        if (user && user.isAuthenticated) {
          document.title = Title;
          if (UserActivity) {
            void logActivityData(UserActivity);
          }
        }
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [Title, logActivityData, UserActivity, isLoading, getUser, windowSizeJson, router, user]);

  return <Container>{children}</Container>;
}
