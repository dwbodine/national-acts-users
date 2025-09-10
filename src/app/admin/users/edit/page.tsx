import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminUserEdit from '../../../../components/admin/users/adminUserEditComponent';

export default function AdminUsersEdit() {
  const title = 'Client Portal - Edit User';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminUserEdit />}
    />
  );
}
