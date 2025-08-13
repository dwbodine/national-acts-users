import { ActivePageKey } from '@/constants';
import AdminOrdersIndex from '../../../../components/admin/events/orders/adminOrderIndexComponent';
import AdminPage from '../../../../components/common/adminPageComponent';
import { PageProps } from '@/types/props';

export default async function AdminOrders(props: PageProps) {
  const title = 'Client Portal - Admin Orders';  
  const { id } = await props.searchParams;
  const orderId = id ? Number(id) : 0;
  
  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminOrdersIndex Id={orderId} />}
    />
  );
}
