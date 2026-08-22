import AdminRefundPoliciesIndex from '@/components/admin/refunds/adminRefundsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminRefundPolicies() {
  const title = 'Client Portal - Manage Refund Policies';

  return (
    <AdminPage Title={title}>
      <AdminRefundPoliciesIndex />
    </AdminPage>
  );
}
