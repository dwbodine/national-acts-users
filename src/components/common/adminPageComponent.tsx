"use client";

import { useEffect, useState } from 'react';
import { AdminPageProps } from '@/types/props';
import AdminTabs from './adminTabsComponent';
import AdminTabsMobile from './adminTabsMobileComponent';
import { Container } from 'react-bootstrap';
import NavBar from './navBarComponent';
import { RootState } from '@/lib/store';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function AdminPage(props: AdminPageProps) {
  const { getUser } = useCurrentUser();
  const [notAdmin, setNotAdmin] = useState(true);
  const { logActivityData } = useLogActivityData();
  const activeKey = props.ActiveKey;
  const title = props.Title;
  const userActivity = props.UserActivity;
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSettings;
  const router = useRouter();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentUser = getUser();
      if (currentUser && currentUser.isAuthenticated) {
        setNotAdmin(!currentUser.isAdmin);
        if (currentUser.isAdmin) {
          document.title = title;
          if (userActivity) {
            logActivityData(userActivity);
          }
        } else {
          router.push('/logout/');
        }
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [title, logActivityData, userActivity, isLoading, getUser, windowSizeJson, router]);



  return (
    <>
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
