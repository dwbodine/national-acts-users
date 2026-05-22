import AdminPage from '@/components/common/adminPageComponent';
import AdminSellersComponent from '@/components/sales/events/adminSellersComponent';
import { UserActivityType } from '@/types/user';

export default function AdminHome() {
  const title = 'Client Portal - Sales Overview';

  return (
    <AdminPage Title={title} UserActivity={UserActivityType.AccessSalesOverView}>
      <AdminSellersComponent />
    </AdminPage>
  );
}
