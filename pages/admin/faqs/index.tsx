import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminFaqsIndex from '../../../components/admin/faqs/adminFaqsIndexComponent';

export default function AdminFaqs() {
  const title = 'Client Portal - Manage FAQs';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminFaqsIndex />}
    />
  );
}
