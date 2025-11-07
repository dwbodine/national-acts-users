import AdminPage from '@/components/common/adminPageComponent';
import AdminPagesIndex from '@/components/admin/page-manager/adminPagesIndexComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Pages';

  return (
    <AdminPage Title={title}>
      <AdminPagesIndex />
    </AdminPage>
  );
}
