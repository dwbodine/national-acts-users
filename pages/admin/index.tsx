import { ActivePageKey } from '@/constants';
import AdminIndex from '../../components/admin/adminIndexComponent';
import AdminPage from '../../components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';

export default function Admin() {
  const title = 'Client Portal - Admin';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminIndex />}
      UserActivity={UserActivityType.AccessAdmin}
    />
  );
}
