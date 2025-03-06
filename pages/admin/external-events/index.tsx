import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminExternalEventsIndex from '../../../components/admin/external-events/adminExternalEventsIndexComponent';

export default function AdminExternalEvents() {
  const title = 'Client Portal - Admin External Events';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminExternalEventsIndex />}
    />
  );
}
