import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';
import CurrentEvents from '../../components/sales/events/currentEventsComponent';
import SalesBar from '../../components/sales/events/salesBarComponent';

export default function AdminHome() {
  const title = 'Client Portal - Sales Overview';
  const salesComponent = (
    <>
      <SalesBar />
      <CurrentEvents />
    </>
  );

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.SalesOverview}
      SalesComponent={salesComponent}
      UserActivity={UserActivityType.AccessSalesOverView}
    />
  );
}
