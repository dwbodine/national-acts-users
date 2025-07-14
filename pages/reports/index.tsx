import { ActivePageKey } from '@/constants';
import AdminPage from '../../components/common/adminPageComponent';
import ReportsIndex from '../../components/reports/reportsIndexComponent';
import { UserActivityType } from '@/types/user';

export default function Reports() {
  const title = 'Client Portal - Reports';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Reports}
      ReportComponent={<ReportsIndex />}
      UserActivity={UserActivityType.AccessReports}
    />
  );
}
