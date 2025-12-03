import AdminSellerGlobalIndex from '@/components/admin/sellers/adminSellerGlobalIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminGlobalSellers() {
  const title = 'Client Portal - Manage Global Seller Settings';

  return (
    <AdminPage Title={title}>
      <AdminSellerGlobalIndex />
    </AdminPage>
  );
}
