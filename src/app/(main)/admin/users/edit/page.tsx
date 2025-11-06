import AdminPage from '@/components/common/adminPageComponent';
import AdminUserEdit from '@/components/admin/users/adminUserEditComponent';

export default function AdminUsersEdit() {
  const title = 'Client Portal - Edit User';

  return (
    <AdminPage Title={title}>
      <AdminUserEdit />
    </AdminPage>
  );
}
