import AdminPage from '@/components/common/adminPageComponent';
import UserAdminComponent from '@/components/admin/users/userAdminComponent';

export default function Users() {
  const title = 'Client Portal - User Activity';

  return (
    <AdminPage Title={title}>
      <UserAdminComponent />
    </AdminPage>
  );
}
