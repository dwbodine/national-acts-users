import AdminFanMomentEdit from '@/components/admin/fan-moments/adminFanMomentEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminFanMomentsEditPage() {
  const title = 'Client Portal - Edit Fan Moment';

  return (
    <AdminPage Title={title}>
      <AdminFanMomentEdit />
    </AdminPage>
  );
}
