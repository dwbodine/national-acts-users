import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminEventEdit from '../../../components/admin/events/adminEventEditComponent';

export default function AdminEventsEdit() {
  const title = 'Client Portal - Edit Event';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminEventEdit />}
    />
  );
}
