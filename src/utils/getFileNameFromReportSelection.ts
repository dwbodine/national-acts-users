import { UserReportSelection } from '@/types/user';
import moment from 'moment';

export default function getFileNameFromReportSelection(
  currentReportSelection: UserReportSelection | undefined,
  fileNameStub?: string,
) {
  let fileName = '';
  if (
    currentReportSelection &&
    currentReportSelection.seller &&
    currentReportSelection.seller.sellerId !== 0
  ) {
    const { sellerName } = currentReportSelection.seller;
    const { start, end } = currentReportSelection;
    let stub = '';
    const hash = moment().unix();
    if (fileNameStub) {
      stub = `_${fileNameStub}`;
    }
    fileName = `${sellerName}${stub}_${start}_${end}_${hash}.csv`;
  }
  return fileName;
}
