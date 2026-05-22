import AdminPage from '@/components/common/adminPageComponent';
import ReportsMissingVenues from '@/components/reports/missing-venues/reportsMissingVenuesComponent';

export default function CustomerExportReport() {
  const title = 'Client Portal - Missing Venue Report';

  return (
    <AdminPage Title={title}>
      <ReportsMissingVenues />
    </AdminPage>
  );
}
