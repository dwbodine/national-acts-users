import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import ReportsMissingVenues from '../../../components/reports/missing-venues/reportsMissingVenuesComponent';

export default function CustomerExportReport() {
  const title = 'Client Portal - Missing Venue Report';

  return (
    <AdminPage
      title={title}
      activeKey={ActivePageKey.Reports}
      reportComponent={<ReportsMissingVenues />}
    />
  );
}
