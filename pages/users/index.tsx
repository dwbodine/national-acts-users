import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import UserActivityTable from '../../components/users/userActivityTable';
import UserActivityBar from '../../components/users/userActivityBarComponent';

export default function Users() {
  const title = "Client Portal - User Activity";
  const userComponent = <><UserActivityBar /><UserActivityTable /></>

  return (
    <AdminPage title={title} activeKey={ActivePageKey.Users} usersComponent={userComponent} />
  );
}