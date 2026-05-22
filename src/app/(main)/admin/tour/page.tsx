import AdminToursIndex from '@/components/admin/tour/adminToursIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminTours() {
  const title = 'Client Portal - Admin Tours';

  return (
    <AdminPage Title={title}>
      <AdminToursIndex />
    </AdminPage>
  );
}
