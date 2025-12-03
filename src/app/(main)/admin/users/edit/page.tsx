import AdminUserEdit from '@/components/admin/users/adminUserEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminUsersEdit() {
  const title = 'Client Portal - Edit User';

  return (
    <AdminPage Title={title}>
      <AdminUserEdit />
    </AdminPage>
  );
}
