import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminEventsIndex from '../../../components/admin/events/adminEventsIndexComponent';

export default function AdminEvents() {
  const title = 'Client Portal - Admin Events';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminEventsIndex />}
    />
  );
}
