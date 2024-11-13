import AdminUserEdit from '../../../components/admin/users/adminUserEditComponent';
import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';

export default function AdminUsersEdit() {
  const title = 'Client Portal - Edit User';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminUserEdit />}
    />
  );
}
