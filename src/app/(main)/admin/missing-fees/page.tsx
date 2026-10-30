import AdminFeesIndex from '@/components/admin/missing-fees/adminFeesIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminMissingFees() {
  return (
    <AdminPage Title="Client Portal - Manage Missing Fees">
      <AdminFeesIndex />
    </AdminPage>
  );
}
