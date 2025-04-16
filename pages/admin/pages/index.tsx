import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminPagesIndex from '../../../components/admin/pages/adminPagesIndexComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Global Seller Settings';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminPagesIndex />}
    />
  );
}
