import AdminPagesIndex from '@/components/admin/page-manager/adminPagesIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Pages';

  return (
    <AdminPage Title={title}>
      <AdminPagesIndex />
    </AdminPage>
  );
}
