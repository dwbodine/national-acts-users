import AdminUsersIndex from '@/components/admin/users/adminUsersIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminUsers() {
  const title = 'Client Portal - Admin Users';

  return (
    <AdminPage Title={title}>
      <AdminUsersIndex />
    </AdminPage>
  );
}
