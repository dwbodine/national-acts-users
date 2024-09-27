import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import { UserActivityType } from '@/types/user';
import CurrentEvents from "../../components/sales/events/currentEventsComponent";
import AdminBar from "../../components/sales/events/salesBarComponent";

export default function AdminHome() {
  const title = "Client Portal - Sales Overview";
  const salesComponent = <><AdminBar /><CurrentEvents /></>

  return (
    <AdminPage title={title} activeKey={ActivePageKey.SalesOverview} salesComponent={salesComponent} userActivity={UserActivityType.AccessSalesOverView} />
  );
}