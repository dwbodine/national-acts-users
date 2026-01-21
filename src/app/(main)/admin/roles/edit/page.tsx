import AdminRoleEdit from '@/components/admin/roles/adminRoleEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminRolesEdit() {
  const title = 'Client Portal - Edit Role';

  return (
    <AdminPage Title={title}>
      <AdminRoleEdit />
    </AdminPage>
  );
}
