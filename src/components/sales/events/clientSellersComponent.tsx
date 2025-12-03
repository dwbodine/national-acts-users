'use client';

import { useEffect, useState } from 'react';
import Container from 'rsuite/Container';

import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { User, UserActivityType } from '@/types/user';

import NavBar from '../../common/navBarComponent';
import CurrentEvents from './currentEventsComponent';
import AdminBar from './salesBarComponent';

export default function ClientSellersComponent() {
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }
    if (user && user.isAuthenticated) {
      document.title = 'Client Portal - Sales Overview';
      void logActivityData(UserActivityType.AccessSalesOverView);
    }
  }, [user, logActivityData, getUser]);

  const notLoggedIn = !user || !user.isAuthenticated;
  const adminUser = user && user.isAuthenticated && user.isAdmin;

  return (
    <>
      <NavBar Hidden={notLoggedIn || adminUser} />
      <Container className="fluid" hidden={notLoggedIn || adminUser}>
        <AdminBar />
        <CurrentEvents />
      </Container>
    </>
  );
}
