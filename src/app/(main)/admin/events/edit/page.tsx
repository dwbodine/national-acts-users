import AdminEventEdit from '@/components/admin/events/adminEventEditComponent';
import AdminPage from '@/components/common/adminPageComponent';
import { PageProps } from '@/types/props';

export default async function AdminEventsEdit(props: PageProps) {
  const title = 'Client Portal - Edit Event';
  const { id } = await props.searchParams;
  const eventId = id ? Number(id) : 0;

  return (
    <AdminPage Title={title}>
      <AdminEventEdit Id={eventId} />
    </AdminPage>
  );
}
