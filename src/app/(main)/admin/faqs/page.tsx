import AdminFaqsIndex from '@/components/admin/faqs/adminFaqsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminFaqs() {
  const title = 'Client Portal - Manage FAQs';

  return (
    <AdminPage Title={title}>
      <AdminFaqsIndex />
    </AdminPage>
  );
}
