'use client';

import { User, UserActivityType } from '@/types/user';
import { useEffect, useState } from 'react';
import AdminBar from './salesBarComponent';
import Container from 'rsuite/Container';
import CurrentEvents from './currentEventsComponent';
import NavBar from '../../common/navBarComponent';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';

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
