import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import RefreshTicketSocketData from '../../../components/admin/refresh-data/refreshTicketSocketDataComponent';

export default function AdminRefreshData() {
  const title = 'Client Portal - Refresh Data from TicketSocket';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<RefreshTicketSocketData />}
    />
  );
}
