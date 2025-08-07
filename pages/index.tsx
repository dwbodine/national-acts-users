import { User, UserActivityType } from '@/types/user';
import { useEffect, useState } from 'react';
import AdminBar from '../components/sales/events/salesBarComponent';
import CheckAuth from '../components/common/checkAuthComponent';
import Container from 'react-bootstrap/Container';
import CurrentEvents from '../components/sales/events/currentEventsComponent';
import NavBar from '../components/common/navBarComponent';
import router from 'next/router';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';

export default function Home() {
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }
    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        router.push('/sellers/');
      } else {
        document.title = 'Client Portal - Sales Overview';
        logActivityData(UserActivityType.AccessSalesOverView);
      }
    }
  }, [user, logActivityData, getUser]);

  const notLoggedIn = !user || !user.isAuthenticated;
  const adminUser = user && user.isAuthenticated && user.isAdmin;

  return (
    <>
      <CheckAuth />
      <NavBar Hidden={notLoggedIn || adminUser} />
      <Container fluid hidden={notLoggedIn || adminUser} className="vipContainer">
        <AdminBar />
        <CurrentEvents />
      </Container>
    </>
  );
}
