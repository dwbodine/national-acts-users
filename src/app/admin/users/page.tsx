import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminUsersIndex from '../../../components/admin/users/adminUsersIndexComponent';

export default function AdminUsers() {
  const title = 'Client Portal - Admin Users';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminUsersIndex />}
    />
  );
}
