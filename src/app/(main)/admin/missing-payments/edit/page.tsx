import AdminPaymentEdit from '@/components/admin/missing-payments/adminPaymentEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminPaymentsEdit() {
  const title = 'Client Portal - Add/Edit Missing Payment';

  return (
    <AdminPage Title={title}>
      <AdminPaymentEdit />
    </AdminPage>
  );
}
