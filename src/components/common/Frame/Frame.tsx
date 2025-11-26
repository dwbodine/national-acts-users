'use client';

import { adminAppNavs, userAppNavs } from './config';
import { useEffect, useState } from 'react';
import Brand from './Brand';
import { Content } from 'rsuite';
import Header from './Header';
import NavToggle from './NavToggle';
import { FrameProps } from '@/types/props';
import { NavItemData } from '@/types/public';
import { RootState } from '@/lib/store';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useSelector } from 'react-redux';
import { User } from '@/types/user';
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
