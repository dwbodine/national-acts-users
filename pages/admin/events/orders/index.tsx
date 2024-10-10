import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminOrdersIndex from '../../../../components/admin/events/orders/adminOrderIndexComponent';

export default function AdminOrders() {
  const title = "Client Portal - Admin Orders";

  return (
    <AdminPage title={title} activeKey={ActivePageKey.Admin} adminComponent={<AdminOrdersIndex />} />
  );
}