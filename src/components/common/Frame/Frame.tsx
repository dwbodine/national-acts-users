'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Content } from 'rsuite';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { RootState } from '@/lib/store';
import { FrameProps } from '@/types/props';
import { NavItemData } from '@/types/public';
import { EnumPermission, User } from '@/types/user';

import WaitSpinner from '../WaitSpinnerComponent';
import Brand from './Brand';
import { adminAppNavs, userAppNavs } from './config';
import Header from './Header';
import NavToggle from './NavToggle';
import ResponsiveFrame from './ResponsiveFrame';

const Frame = (props: FrameProps) => {
  const { getUser } = useCurrentUser();
  const [navs, setNavs] = useState<NavItemData[] | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    } else if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        setNavs(adminAppNavs);
      } else {
        const canUploadFanMoments = user.sellers?.some((seller) =>
          seller.permissions?.includes(EnumPermission.UploadFanMoments),
        );
        setNavs(
          userAppNavs.filter((nav) => nav.eventKey !== 'site-fan-moments' || canUploadFanMoments),
        );
      }
    }
  }, [user, globalSelection.isLoading]);

  return (
    <Suspense fallback={<WaitSpinner />}>
      <ResponsiveFrame
        navs={navs}
        Brand={Brand}
        Header={Header}
        NavToggle={NavToggle}
        Content={Content}
        IsLoading={globalSelection.isLoading}
      >
        {props.children}
      </ResponsiveFrame>
    </Suspense>
  );
};

export default Frame;
