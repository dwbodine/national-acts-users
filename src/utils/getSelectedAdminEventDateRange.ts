import { EventTabView, DateRange } from '@/types/user';
import moment from 'moment';

export default function getSelectedAdminEventDateRange(
  selectedUnixDate: number,
  tabView: EventTabView,
) {
  let dateRange: DateRange = {
    start: 0,
    end: 0,
  };
  switch (tabView) {
    case EventTabView.Agenda:
    case EventTabView.Month:
      dateRange.start = moment
        .unix(selectedUnixDate)
        .startOf('month')
        .startOf('day')
        .unix();
      dateRange.end = moment.unix(selectedUnixDate).endOf('month').endOf('day').unix();
      break;
    default:
      dateRange.start = moment
        .unix(selectedUnixDate)
        .startOf('week')
        .add(1, 'day')
        .startOf('day')
        .unix();
      dateRange.end = moment
        .unix(selectedUnixDate)
        .startOf('week')
        .add(7, 'days')
        .startOf('day')
        .unix();
      break;
  }
  return dateRange;
}
