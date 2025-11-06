import AdminPage from '@/components/common/adminPageComponent';
import AdminToursIndex from '@/components/admin/tour/adminToursIndexComponent';

export default function AdminTours() {
  const title = 'Client Portal - Admin Tours';

  return (
    <AdminPage Title={title}>
      <AdminToursIndex />
    </AdminPage>
  );
}
