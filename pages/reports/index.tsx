import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import ReportsIndex from '../../components/reports/reportsIndexComponent';
import { UserActivityType } from '@/types/user';

export default function Reports() {
  const title = "Client Portal - Reports";

  return (
    <AdminPage title={title} activeKey={ActivePageKey.Reports} reportComponent={<ReportsIndex />} userActivity={UserActivityType.AccessReports} />
  );
}