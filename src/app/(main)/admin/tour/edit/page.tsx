import AdminTourEdit from '@/components/admin/tour/adminTourEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminToursEdit() {
  const title = 'Client Portal - Edit Tour';

  return (
    <AdminPage Title={title}>
      <AdminTourEdit />
    </AdminPage>
  );
}
