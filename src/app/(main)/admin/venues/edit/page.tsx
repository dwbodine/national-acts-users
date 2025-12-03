import AdminVenueEdit from '@/components/admin/venues/adminVenueEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminVenuesEdit() {
  const title = 'Client Portal - Edit Venue';

  return (
    <AdminPage Title={title}>
      <AdminVenueEdit />
    </AdminPage>
  );
}
