import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminPageOrderIndex from '../../../../components/admin/pages/order/adminPageOrderIndexComponent';

export default function AdminPages() {
  const title = 'Client Portal - Manage Client Page Order';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminPageOrderIndex />}
    />
  );
}
