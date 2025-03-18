import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminExternalEventsSeller from '../../../components/admin/external-events/adminExternalEventsSellerComponent';

export default function AdminExternalEventsSellers() {
  const title = 'Client Portal - External Events By Seller';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Admin}
      adminComponent={<AdminExternalEventsSeller />}
    />
  );
}
