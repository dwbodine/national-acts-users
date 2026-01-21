import AdminPageEdit from '@/components/admin/page-manager/adminPageEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminPagesEdit() {
  const title = 'Client Portal - Edit Page';

  return (
    <AdminPage Title={title}>
      <AdminPageEdit />
    </AdminPage>
  );
}
