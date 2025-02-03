import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminSiteSettingsEdit from '../../../components/admin/sitesettings/adminSiteSettingsEditComponent';

export default function AdminSiteSettings() {
  const title = 'Client Portal - Manage Site Settings';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminSiteSettingsEdit />}
    />
  );
}
