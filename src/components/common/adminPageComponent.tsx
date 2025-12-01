'use client';

import { AdminPageProps } from '@/types/props';
import { Container } from 'rsuite';
import { RootState } from '@/lib/store';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useEffect } from 'react';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function AdminPage({ Title, UserActivity, children }: AdminPageProps) {
  const { getUser } = useCurrentUser();
  const { logActivityData } = useLogActivityData();
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSettings;
  const router = useRouter();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentUser = getUser();
      if (currentUser && currentUser.isAuthenticated) {
        document.title = Title;
        if (UserActivity) {
          void logActivityData(UserActivity);
        }
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [Title, logActivityData, UserActivity, isLoading, getUser, windowSizeJson, router]);

  return <Container>{children}</Container>;
}
