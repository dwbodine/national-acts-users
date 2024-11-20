import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminLogIndex from '../../../components/admin/log/adminLogIndexComponent';

export default function AdminLog() {
  const title = 'Client Portal - Log';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminLogIndex />}
    />
  );
}
