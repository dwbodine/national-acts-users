import AdminSiteSettingsEdit from '@/components/admin/sitesettings/adminSiteSettingsEditComponent';
import AdminPage from '@/components/common/adminPageComponent';

export default function AdminSiteSettings() {
  const title = 'Client Portal - Manage Site Settings';

  return (
    <AdminPage Title={title}>
      <AdminSiteSettingsEdit />
    </AdminPage>
  );
}
