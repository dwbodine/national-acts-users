import AdminSellerGlobalEdit from '@/components/admin/sellers/adminSellerGlobalEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminGlobalSellersEdit() {
  const title = 'Client Portal - Edit Global Seller Settings';

  return (
    <AdminPage Title={title}>
      <AdminSellerGlobalEdit />
    </AdminPage>
  );
}
