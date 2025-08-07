import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminRolesIndex from '../../../components/admin/roles/adminRolesIndexComponent';

export default function AdminRoles() {
  const title = 'Client Portal - Admin Roles';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminRolesIndex />}
    />
  );
}
