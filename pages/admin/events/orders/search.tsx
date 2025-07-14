import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminOrdersSearch from '../../../../components/admin/events/orders/adminOrderSearchComponent';

export default function AdminOrderSearch() {
  const title = 'Client Portal - Search Orders';
  
  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminOrdersSearch />}
    />
  );
}
