import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminExternalEventEdit from '../../../components/admin/external-events/adminExternalEventEditComponent';

export default function AdminExternalEventsEdit() {
  const title = 'Client Portal - Edit External Event';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminExternalEventEdit />}
    />
  );
}
