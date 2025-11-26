'use client';

import { adminAppNavs, userAppNavs } from './config';
import { useEffect, useState } from 'react';
import Brand from './Brand';
import { Content } from 'rsuite';
import { FrameProps } from '@/types/props';
import Header from './Header';
import { NavItemData } from '@/types/public';
import NavToggle from './NavToggle';
import ResponsiveFrame from './ResponsiveFrame';
import { RootState } from '@/lib/store';
import { User } from '@/types/user';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useSelector } from 'react-redux';

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
        setNavs(userAppNavs);
      }
    }
  }, [user, navs]);

  return (
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
  );
};

export default Frame;
