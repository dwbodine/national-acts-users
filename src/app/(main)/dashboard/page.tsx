import AdminPage from '@/components/common/adminPageComponent';
import DashboardIndex from '@/components/dashboard/dashboardIndexComponent';

import { UserActivityType } from '@/types/user';

export default function Dashboard() {
  const title = 'Client Portal - Home';

  return (
    <AdminPage Title={title} UserActivity={UserActivityType.AccessDashboard}>
      <DashboardIndex />
    </AdminPage>
  );
}
