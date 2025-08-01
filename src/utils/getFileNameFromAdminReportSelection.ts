import { AdminReportsSelection } from '@/types/user';
import moment from 'moment';

export default function getFileNameFromReportAdminSelection(
  reportName: string,
  currentReportSelection: AdminReportsSelection | undefined,
) {
  let fileName = '';
  if (
    currentReportSelection &&
    currentReportSelection.start &&
    currentReportSelection.end
  ) {
    const {start, end} = currentReportSelection;
    const hash = moment().unix();
    fileName = `${reportName}_${start}_${end}_${hash}.csv`;
  }
  return fileName;
}
