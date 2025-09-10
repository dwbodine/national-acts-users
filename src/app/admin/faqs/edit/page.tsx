import { ActivePageKey } from '@/constants';
import AdminFaqEdit from '../../../../components/admin/faqs/adminFaqEditComponent';
import AdminPage from '../../../../components/common/adminPageComponent';

export default function AdminFaqsEdit() {
  const title = 'Client Portal - Edit FAQ';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminFaqEdit />}
    />
  );
}
