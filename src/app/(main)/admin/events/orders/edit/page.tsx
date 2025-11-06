import { ActivePageKey } from '@/constants';
import AdminOrderEdit from '../../../../../../components/admin/events/orders/adminOrderEditComponent';
import AdminPage from '../../../../../../components/common/adminPageComponent';
import { PageProps } from '@/types/props';

export default async function AdminOrdersEdit(props: PageProps) {
  const title = 'Client Portal - Edit Order';
  const { id } = await props.searchParams;
  const orderId = id ? Number(id) : 0;

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminOrderEdit Id={orderId} />}
    />
  );
}
