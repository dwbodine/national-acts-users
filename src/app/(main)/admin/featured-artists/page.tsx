import AdminFeaturedArtistsIndex from '@/components/admin/featured-artists/adminFeaturedArtistsIndexComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminFeaturedArtistsPage() {
  const title = 'Client Portal - Featured Artists';

  return (
    <AdminPage Title={title}>
      <AdminFeaturedArtistsIndex />
    </AdminPage>
  );
}
