import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminToursIndex from '../../../components/admin/tour/adminToursIndexComponent';

export default function AdminTours() {
  const title = 'Client Portal - Admin Tours';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminToursIndex />}
    />
  );
}
