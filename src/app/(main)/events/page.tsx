import EventAdminComponent from '@/components/admin/events/eventAdminComponent';
import AdminPage from '@/components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';

export default function AdminHome() {
  const title = 'Client Portal - Upcoming Events Overview';

  return (
    <AdminPage Title={title} UserActivity={UserActivityType.AdminEventsOverview}>
      <EventAdminComponent />
    </AdminPage>
  );
}
