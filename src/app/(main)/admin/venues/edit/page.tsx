import AdminPage from '@/components/common/adminPageComponent';
import AdminVenueEdit from '@/components/admin/venues/adminVenueEditComponent';

export default function AdminVenuesEdit() {
  const title = 'Client Portal - Edit Venue';

  return (
    <AdminPage Title={title}>
      <AdminVenueEdit />
    </AdminPage>
  );
}
