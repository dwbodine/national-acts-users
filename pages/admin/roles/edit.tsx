import AdminRoleEdit from '../../../components/admin/roles/adminRoleEditComponent';
import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';

export default function AdminRolesEdit() {
  const title = 'Client Portal - Edit Role';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminRoleEdit />}
    />
  );
}
