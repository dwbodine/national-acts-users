import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminTourEdit from '../../../components/admin/tour/adminTourEditComponent';

export default function AdminToursEdit() {
  const title = 'Client Portal - Edit Tour';
  
  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminTourEdit />}
    />
  );
}
