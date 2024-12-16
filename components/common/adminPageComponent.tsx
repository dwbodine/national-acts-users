import { ActivePageKey } from '@/constants';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import router from 'next/router';
import { useEffect, useState } from 'react';
import CheckAuth from './checkAuthComponent';
import NavBar from './navBarComponent';
import { Container } from 'react-bootstrap';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { UserActivityType } from '@/types/user';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AdminTabs from './adminTabsComponent';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import AdminTabsMobile from './adminTabsMobileComponent';

export default function AdminPage(props: any) {
  const { getUser } = useCurrentUser();
  const [notAdmin, setNotAdmin] = useState(true);
  const { logActivityData } = useLogActivityData();
  const activeKey = props.activeKey as ActivePageKey;
  const title = props.title as string;
  const userActivity = props.userActivity as UserActivityType | undefined;
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSettings.isLoading;

  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentUser = getUser();
      if (currentUser && currentUser.isAuthenticated) {
        setNotAdmin(!currentUser.isAdmin);
        if (!currentUser.isAdmin) {
          router.push('/logout/');
        } else {
          document.title = title;
          if (userActivity) {
            logActivityData(userActivity);
          }
        }
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [title, logActivityData, userActivity, isLoading, getUser, windowSizeJson]);

  

  return (
    <>
      <CheckAuth />
      <NavBar hidden={notAdmin} />
      <Container fluid hidden={notAdmin} className="vipContainer">
        {windowSize.isMobile ? 
        <AdminTabsMobile
          ActiveKey={activeKey}
          IsLoading={isLoading}
          NotAdmin={notAdmin}
          DashboardComponent={props.dashboardComponent}
          EventsComponent={props.eventsComponent}
          SalesComponent={props.salesComponent}
          AdminComponent={props.adminComponent}
          ReportComponent={props.reportComponent}
          UsersComponent={props.usersComponent}
        />
        :
        <AdminTabs
          ActiveKey={activeKey}
          IsLoading={isLoading}
          NotAdmin={notAdmin}
          DashboardComponent={props.dashboardComponent}
          EventsComponent={props.eventsComponent}
          SalesComponent={props.salesComponent}
          AdminComponent={props.adminComponent}
          ReportComponent={props.reportComponent}
          UsersComponent={props.usersComponent}
         /> 
         }
      </Container>
    </>
  );
}
