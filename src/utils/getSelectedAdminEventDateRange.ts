import { DateRange, EventTabView } from '@/types/user';
import moment from 'moment';

export default function getSelectedAdminEventDateRange(
  selectedUnixDate: number,
  tabView: EventTabView,
) {
  const dateRange: DateRange = {
    end: 0,
    start: 0,
  };
  switch (tabView) {
    case EventTabView.Agenda:
      dateRange.periodStart = moment
        .unix(selectedUnixDate)
        .startOf('month')
        .startOf('day')
        .unix();
      dateRange.start = dateRange.periodStart;
      dateRange.end = moment.unix(dateRange.start).endOf('month').endOf('day').unix();
      break;
    case EventTabView.Month:
      dateRange.periodStart = moment.unix(selectedUnixDate).startOf('month').unix();
      dateRange.start = moment
        .unix(selectedUnixDate)
        .startOf('month')
        .startOf('week')
        .startOf('day')
        .unix();
      dateRange.end = moment
        .unix(selectedUnixDate)
        .endOf('month')
        .endOf('week')
        .endOf('day')
        .unix();
      break;
    default:
      dateRange.periodStart = moment
        .unix(selectedUnixDate)
        .startOf('week')
        .add(1, 'day')
        .startOf('day')
        .unix();
      dateRange.start = dateRange.periodStart;
      dateRange.end = moment
        .unix(dateRange.start)
        .endOf('week')
        .add(1, 'day')
        .endOf('day')
        .unix();
      break;
  }
  return dateRange;
}
