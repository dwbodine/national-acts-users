import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import EventAdminComponent from '../../components/admin/events/eventAdminComponent';
import { UserActivityType } from '@/types/user';

export default function AdminHome() {
  const title = 'Client Portal - Upcoming Events Overview';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Events}
      EventsComponent={<EventAdminComponent />}
      UserActivity={UserActivityType.AdminEventsOverview}
    />
  );
}
