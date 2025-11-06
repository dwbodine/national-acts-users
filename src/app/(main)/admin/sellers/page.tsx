import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminSellerGlobalIndex from '../../../../components/admin/sellers/adminSellerGlobalIndexComponent';

export default function AdminGlobalSellers() {
  const title = 'Client Portal - Manage Global Seller Settings';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminSellerGlobalIndex />}
    />
  );
}
