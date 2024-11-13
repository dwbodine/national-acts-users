import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';
import AdminIndex from '../../components/admin/adminIndexComponent';

export default function Admin() {
  const title = 'Client Portal - Admin';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminIndex />}
      userActivity={UserActivityType.AccessAdmin}
    />
  );
}
