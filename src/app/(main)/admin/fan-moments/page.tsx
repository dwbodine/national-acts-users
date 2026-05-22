import AdminFanMomentsIndex from '@/components/admin/fan-moments/adminFanMomentsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminFanMomentsPage() {
  const title = 'Client Portal - Manage Fan Moments';

  return (
    <AdminPage Title={title}>
      <AdminFanMomentsIndex />
    </AdminPage>
  );
}
