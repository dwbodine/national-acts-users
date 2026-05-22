import RefreshTicketSocketData from '@/components/admin/refresh-data/refreshTicketSocketDataComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminRefreshData() {
  const title = 'Client Portal - Refresh Data from TicketSocket';

  return (
    <AdminPage Title={title}>
      <RefreshTicketSocketData />
    </AdminPage>
  );
}
