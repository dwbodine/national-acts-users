import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminFaqEdit from '../../../components/admin/faqs/adminFaqEditComponent';

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
