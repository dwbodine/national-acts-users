'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'rsuite';

import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { setCurrentUser } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { AdminPageProps } from '@/types/props';

export default function AdminPage({ Title, UserActivity, children }: AdminPageProps) {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const { logActivityData } = useLogActivityData();
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSettings;
  const router = useRouter();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!globalSettings.currentUser) {
        const currentUser = getUser();
        if (currentUser) {
          dispatch(setCurrentUser(currentUser));
        }
      } else {
        const currentUser = globalSettings.currentUser;
        if (currentUser && currentUser.isAuthenticated) {
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
  }, [
    Title,
    logActivityData,
    UserActivity,
    isLoading,
    getUser,
    windowSizeJson,
    router,
    globalSettings.currentUser,
  ]);

  return <Container>{children}</Container>;
}
