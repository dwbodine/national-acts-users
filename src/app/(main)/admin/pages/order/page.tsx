import AdminPageOrderIndex from '@/components/admin/page-manager/order/adminPageOrderIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Client Page Order';

  return (
    <AdminPage Title={title}>
      <AdminPageOrderIndex />
    </AdminPage>
  );
}
