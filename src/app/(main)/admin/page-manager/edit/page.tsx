import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../../components/common/adminPageComponent';
import AdminPageEdit from '../../../../../components/admin/page-manager/adminPageEditComponent';

export default function AdminPagesEdit() {
  const title = 'Client Portal - Edit Page';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminPageEdit />}
    />
  );
}
