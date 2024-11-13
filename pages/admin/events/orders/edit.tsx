import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminOrderEdit from '../../../../components/admin/events/orders/adminOrderEditComponent';

export default function AdminOrdersEdit() {
  const title = 'Client Portal - Edit Order';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminOrderEdit />}
    />
  );
}
