import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import DashboardIndex from '../../components/dashboard/dashboardIndexComponent';
import { UserActivityType } from '@/types/user';
import { setReloadDashboardOrders } from '@/lib/dashboardSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const { logActivityData } = useLogActivityData();
  const title = 'Client Portal - Home';

  useEffect(() => {
    const user = getUser();
    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        logActivityData(UserActivityType.AccessDashboard).then(() => {
          dispatch(setReloadDashboardOrders(true));
        });
      }
    }
  }, [logActivityData, dispatch, getUser]);

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Dashboard}
      DashboardComponent={<DashboardIndex />}
    />
  );
}
