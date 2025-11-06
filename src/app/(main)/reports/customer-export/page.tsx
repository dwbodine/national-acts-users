import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import ReportsCustomerExport from '../../../components/reports/customer-export/reportsCustomerExportComponent';

export default function CustomerExportReport() {
  const title = 'Client Portal - Customer Export';

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Reports}
      ReportComponent={<ReportsCustomerExport />}
    />
  );
}
