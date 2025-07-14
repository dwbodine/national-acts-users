import { AdminDashboardSelection } from '@/types/user';
import moment from 'moment';

export default function getFileNameFromDashboardReportSelection(
  reportName: string,
  currentDashboardSelection: AdminDashboardSelection | undefined,
) {
  let fileName = '';
  if (
    currentDashboardSelection &&
    currentDashboardSelection.start &&
    currentDashboardSelection.end
  ) {
    const start = currentDashboardSelection.start;
    const end = currentDashboardSelection.end;
    const hash = moment().unix();
    fileName = `${reportName}_${start}_${end}_${hash}.csv`;
  }
  return fileName;
}
