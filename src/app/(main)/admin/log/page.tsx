import { ActivePageKey } from '@/constants';
import AdminLogIndex from '../../../../components/admin/log/adminLogIndexComponent';
import AdminPage from '../../../../components/common/adminPageComponent';

export default function AdminLog() {
  const title = 'Client Portal - Log';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminLogIndex />}
    />
  );
}
