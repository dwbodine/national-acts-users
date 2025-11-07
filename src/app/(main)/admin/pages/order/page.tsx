import AdminPage from '@/components/common/adminPageComponent';
import AdminPageOrderIndex from '@/components/admin/page-manager/order/adminPageOrderIndexComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Client Page Order';

  return (
    <AdminPage Title={title}>
      <AdminPageOrderIndex />
    </AdminPage>
  );
}
