import AdminOrdersSearch from '@/components/admin/events/orders/adminOrderSearchComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminOrderSearch() {
  const title = 'Client Portal - Search Orders';

  return (
    <AdminPage Title={title}>
      <AdminOrdersSearch />
    </AdminPage>
  );
}
