import AdminPaymentEdit from '@/components/admin/missing-payments/adminPaymentEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminPaymentsEdit() {
  const title = 'Client Portal - Add/Edit Missing Fees';

  return (
    <AdminPage Title={title}>
      <AdminPaymentEdit returnTo={'/admin/missing-fees'} />
    </AdminPage>
  );
}
