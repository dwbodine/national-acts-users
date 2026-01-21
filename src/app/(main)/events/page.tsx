import AdminPage from '@/components/common/adminPageComponent';
import EventAdminComponent from '@/components/events/eventAdminComponent';
import { UserActivityType } from '@/types/user';

export default function AdminHome() {
  const title = 'Client Portal - Upcoming Events Overview';

  return (
    <AdminPage Title={title} UserActivity={UserActivityType.AdminEventsOverview}>
      <EventAdminComponent />
    </AdminPage>
  );
}
