import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';
import EventSalesBar from '../../components/events/eventSalesBarComponent';
import AllEvents from '../../components/events/allEventsComponent';

export default function AdminHome() {
  const title = 'Client Portal - Upcoming Events Overview';
  const eventAdminComponent = (
    <>
      <EventSalesBar />
      <AllEvents />
    </>
  );

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Events}
      eventsComponent={eventAdminComponent}
      userActivity={UserActivityType.AdminEventsOverview}
    />
  );
}
