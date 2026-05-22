import AdminFeaturedArtistsEdit from '@/components/admin/featured-artists/adminFeaturedArtistsEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminFeaturedArtistsEditPage() {
  const title = 'Client Portal - Edit Featured Artist';

  return (
    <AdminPage Title={title}>
      <AdminFeaturedArtistsEdit />
    </AdminPage>
  );
}
