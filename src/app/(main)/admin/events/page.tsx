import AdminEventsIndex from '@/components/admin/events/adminEventsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminEvents() {
  const title = 'Client Portal - Admin Events';

  return (
    <AdminPage Title={title}>
      <AdminEventsIndex />
    </AdminPage>
  );
}
