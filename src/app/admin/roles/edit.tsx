import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminRoleEdit from '../../../components/admin/roles/adminRoleEditComponent';

export default function AdminRolesEdit() {
  const title = 'Client Portal - Edit Role';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminRoleEdit />}
    />
  );
}
