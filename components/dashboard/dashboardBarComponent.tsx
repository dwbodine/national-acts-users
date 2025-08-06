import { Button, Col, Row } from 'react-bootstrap';
import { DateRange, RangeType } from 'rsuite/esm/DateRangePicker';
import {
  setCurrentDashboardData,
  setDashboardDateRange,
} from '@/lib/dashboardSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AdminDashboardSelection } from '@/types/user';
import DateRangeSelector from '../common/dateRangeSelectorComponent';
import { GetOrdersResponse } from '@/types/responses';
import { RootState } from '@/lib/store';
import { downloadCsvFile } from '@/utils/downloadFile';
import { exportDashboardOrdersToCsv } from '@/utils/eventUtils';
import getFileNameFromDashboardReportSelection from '@/utils/getFileNameFromDashboardReportSelection';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetAllOrders } from '@/hooks/order/useGetAllOrders';

export default function DashboardBar() {
  const dispatch = useDispatch();
  const { getAllOrders } = useGetAllOrders();
  const currentDashboardSelection = useSelector(
    (state: RootState) => state.dashboardSelecton,
  );
  const dateRangeTitle = 'Selected date range';

  const pageTitle: string = `Home Dashboard`;

  const ranges: RangeType<DateRange>[] = [
    {
      label: 'This Month',
      value: [moment().startOf('month').startOf('day').toDate(), moment().endOf('month').endOf('day').toDate()]
    },
    {
      label: 'Last Month',
      value: [moment().startOf('month').subtract(1, 'month').startOf('day').toDate(), moment().startOf('month').subtract(1, 'month').endOf('month').endOf('day').toDate()]
    }
  ];

  for (let i = moment().quarter(); i >= 1; i -= 1) {
    ranges.push(
      {
        label: `Q${i} ${moment().year()}`,
        value: [moment().quarter(i).startOf('quarter').startOf('day').toDate(), moment().quarter(i).endOf('quarter').endOf('day').toDate()]
      }
    )
  }

  for (let i = moment().year(); i >= 2022; i -= 1) {
    const startDateStr = `${i}-01-01`;
    ranges.push(
      {
        label: i.toString(),
        value: [moment(startDateStr).startOf('year').startOf('day').toDate(), moment(startDateStr).endOf('year').endOf('day').toDate()]
      }
    )
  }

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    const startDate = moment.unix(selectedStart);
    const endDate = moment.unix(selectedEnd);
    if (startDate.year() < 2022 || endDate.year() < 2022) {
      toast.warning("Invalid selection: no data before 2022");
      return;
    }
    if (startDate.year() > moment().year() || endDate.year() > moment().year()) {
      toast.warning("Invalid selection: dates must be from this year or earlier");
      return;
    }
    if (startDate.year() !== endDate.year()) {
      toast.warning("Invalid selection: selected dates must both be in the same year");
      return;
    }
    const dashboardSelection = { ...currentDashboardSelection };
    dashboardSelection.start = selectedStart;
    dashboardSelection.end = selectedEnd;
    dispatch(setDashboardDateRange(dashboardSelection));
  };

  const exportDashboardData = () => {
    const dashboardSelection: AdminDashboardSelection = { ...currentDashboardSelection };
    if (
      !dashboardSelection.currentDashboardData ||
      !dashboardSelection.start ||
      !dashboardSelection.end
    ) {
      return;
    }

    dispatch(setIsLoading(true));

    getAllOrders(dashboardSelection.start, dashboardSelection.end).then(
      (response: GetOrdersResponse) => {
        if (response.orders && !response.error) {
          if (dashboardSelection.currentDashboardData) {
            const dashboardData = {...dashboardSelection.currentDashboardData };
            dashboardData.orders = response.orders;
            dashboardSelection.currentDashboardData = dashboardData;
            const csvData = exportDashboardOrdersToCsv(dashboardSelection);
            const fileName = getFileNameFromDashboardReportSelection(
              'dashboard-orders',
              dashboardSelection,
            );
            downloadCsvFile(fileName, csvData);
            dispatch(setCurrentDashboardData(dashboardSelection.currentDashboardData));
          }
        }
        dispatch(setIsLoading(false));
      },
    );
  };

  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <span className="title">{pageTitle}</span>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <DateRangeSelector
            DateRangeTitle={dateRangeTitle}
            SelectedStart={currentDashboardSelection?.start}
            SelectedEnd={currentDashboardSelection?.end}
            Disabled={false}
            OnDateChange={onDateChange}
            Ranges={ranges}
          />
          <Button className="dashboard-export-button" onClick={exportDashboardData}>
            Export
          </Button>
        </Col>
      </Row>
    </>
  );
}
