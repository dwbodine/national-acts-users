import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminVenuesIndex from '../../../components/admin/venues/adminVenuesIndexComponent';

export default function AdminVenues() {
  const title = 'Client Portal - Admin Venues';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminVenuesIndex />}
    />
  );
}
