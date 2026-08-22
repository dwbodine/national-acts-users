import AdminRefundPolicyEdit from '@/components/admin/refunds/adminRefundEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminRefundPoliciesEdit() {
  const title = 'Client Portal - Edit Refund Policy';

  return (
    <AdminPage Title={title}>
      <AdminRefundPolicyEdit />
    </AdminPage>
  );
}
