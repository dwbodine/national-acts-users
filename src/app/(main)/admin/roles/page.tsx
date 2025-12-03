import AdminRolesIndex from '@/components/admin/roles/adminRolesIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminRoles() {
  const title = 'Client Portal - Admin Roles';

  return (
    <AdminPage Title={title}>
      <AdminRolesIndex />
    </AdminPage>
  );
}
