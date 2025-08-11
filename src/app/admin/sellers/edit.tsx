import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminSellerGlobalEdit from '../../../components/admin/sellers/adminSellerGlobalEditComponent';

export default function AdminGlobalSellersEdit() {
  const title = 'Client Portal - Edit Global Seller Settings';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminSellerGlobalEdit />}
    />
  );
}
