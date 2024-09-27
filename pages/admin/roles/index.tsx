import AdminRolesIndex from '../../../components/admin/roles/adminRolesIndexComponent';
import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';

export default function AdminRoles() {
  const title = "Client Portal - Admin Roles";

  return (
    <AdminPage title={title} activeKey={ActivePageKey.Admin} adminComponent={<AdminRolesIndex />} />
  );
}