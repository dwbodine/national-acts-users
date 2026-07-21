import AdminPage from '@/components/common/adminPageComponent';
import AdminFanMomentsIndex from '@/components/fan-moments/adminFanMomentsIndexComponent';

export default function AdminFanMomentsPage() {
  const title = 'Client Portal - Manage Fan Moments';

  return (
    <AdminPage Title={title}>
      <AdminFanMomentsIndex />
    </AdminPage>
  );
}
