import AdminUserEdit from '../../../components/admin/users/adminUserEditComponent';
import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminVenueEdit from '../../../components/admin/venues/adminVenueEditComponent';

export default function AdminVenuesEdit() {
  const title = 'Client Portal - Edit Venue';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminVenueEdit />}
    />
  );
}
