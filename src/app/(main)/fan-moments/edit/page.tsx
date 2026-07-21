import AdminPage from '@/components/common/adminPageComponent';
import AdminFanMomentEdit from '@/components/fan-moments/adminFanMomentEditComponent';

export default function AdminFanMomentsEditPage() {
  const title = 'Client Portal - Edit Fan Moment';

  return (
    <AdminPage Title={title}>
      <AdminFanMomentEdit />
    </AdminPage>
  );
}
