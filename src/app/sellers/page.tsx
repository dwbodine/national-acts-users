import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import AdminSellersComponent from '../../components/admin/sellers/adminSellersComponent';
import { UserActivityType } from '@/types/user';

export default function AdminHome() {
  const title = 'Client Portal - Sales Overview';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.SalesOverview}
      SalesComponent={<AdminSellersComponent />}
      UserActivity={UserActivityType.AccessSalesOverView}
    />
  );
}
