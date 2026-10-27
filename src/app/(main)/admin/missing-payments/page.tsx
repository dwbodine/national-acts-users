import AdminPaymentsIndex from '@/components/admin/missing-payments/adminPaymentsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminVenues() {
  const title = 'Client Portal - Manage Missing Payments';

  return (
    <AdminPage Title={title}>
      <AdminPaymentsIndex />
    </AdminPage>
  );
}
