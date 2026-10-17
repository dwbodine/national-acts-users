import AdminOrderEdit from '@/components/admin/events/orders/adminOrderEditComponent';
import AdminPage from '@/components/common/adminPageComponent';
import { PageProps } from '@/types/props';

export default async function AdminOrdersEdit(props: PageProps) {
  const title = 'Client Portal - Edit Order';
  const { id, partnerOrderId } = await props.searchParams;
  const orderId = partnerOrderId ? Number(partnerOrderId) : 0;

  if (id || (partnerOrderId && (!Number.isSafeInteger(orderId) || orderId <= 0))) {
    return (
      <AdminPage Title={title}>
        <p>
          This order link is no longer valid. Reopen the order from the events list or order search.
        </p>
        <a href="/admin/events">Go to events</a>
      </AdminPage>
    );
  }

  return (
    <AdminPage Title={title}>
      <AdminOrderEdit Id={orderId} />
    </AdminPage>
  );
}
