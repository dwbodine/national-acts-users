import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminPagesIndex from '../../../../components/admin/page-manager/adminPagesIndexComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Pages';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminPagesIndex />}
    />
  );
}
