import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import { User, UserActivityType } from '@/types/user';
import DashboardIndex from '../../components/dashboard/dashboardIndexComponent';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useDispatch } from 'react-redux';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useEffect, useState } from 'react';
import { setReloadDashboardOrders } from '@/lib/dashboardSelectionSlice';

export default function Dashboard() {
  const { getUser } = useCurrentUser();
  const dispatch = useDispatch();
  const { logActivityData } = useLogActivityData();

  const title = "Client Portal - Home";

  useEffect(() => {
    const user = getUser();
    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        logActivityData(UserActivityType.AccessDashboard).then(() => {
          dispatch (
            setReloadDashboardOrders(true)
          );
        });
      }      
    }    
  }, [logActivityData, dispatch, getUser]);

  return (
    <AdminPage title={title} activeKey={ActivePageKey.Dashboard} dashboardComponent={<DashboardIndex />} />
  );
}