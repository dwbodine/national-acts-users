import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import router from 'next/router';
import { useEffect, useState } from 'react';
import CheckAuth from './checkAuthComponent';
import NavBar from './navBarComponent';
import { Container } from 'react-bootstrap';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AdminTabs from './adminTabsComponent';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import AdminTabsMobile from './adminTabsMobileComponent';
import { AdminPageProps } from '@/types/props';

export default function AdminPage(props: AdminPageProps) {
  const { getUser } = useCurrentUser();
  const [notAdmin, setNotAdmin] = useState(true);
  const { logActivityData } = useLogActivityData();
  const activeKey = props.ActiveKey;
  const title = props.Title;
  const userActivity = props.UserActivity;
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
      <NavBar Hidden={notAdmin} />
      <Container fluid hidden={notAdmin} className="vipContainer">
        {windowSize.isMobile ? 
        <AdminTabsMobile
          ActiveKey={activeKey}
          IsLoading={isLoading}
          NotAdmin={notAdmin}
          DashboardComponent={props.DashboardComponent}
          EventsComponent={props.EventsComponent}
          SalesComponent={props.SalesComponent}
          AdminComponent={props.AdminComponent}
          ReportComponent={props.ReportComponent}
          UsersComponent={props.UsersComponent}
        />
        :
        <AdminTabs
          ActiveKey={activeKey}
          IsLoading={isLoading}
          NotAdmin={notAdmin}
          DashboardComponent={props.DashboardComponent}
          EventsComponent={props.EventsComponent}
          SalesComponent={props.SalesComponent}
          AdminComponent={props.AdminComponent}
          ReportComponent={props.ReportComponent}
          UsersComponent={props.UsersComponent}
         /> 
         }
      </Container>
    </>
  );
}
