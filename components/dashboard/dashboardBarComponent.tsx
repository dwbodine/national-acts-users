import DateRangeSelector from '../common/dateRangeSelectorComponent';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setCurrentDashboardData,
  setDashboardDateRange,
} from '@/lib/dashboardSelectionSlice';
import { Button } from 'react-bootstrap';
import { useGetExport } from '@/hooks/common/useGetExport';
import getFileNameFromDashboardReportSelection from '@/utils/getFileNameFromDashboardReportSelection';
import downloadFile from '@/utils/downloadFile';
import { useGetAllOrders } from '@/hooks/order/useGetAllOrders';
import moment from 'moment';
import { GetOrdersResponse } from '@/types/event';
import { toast } from 'react-toastify';
import { DateRange, RangeType } from 'rsuite/esm/DateRangePicker';

export default function DashboardBar() {
  const dispatch = useDispatch();
  const { getAllOrders } = useGetAllOrders();
  const { exportDashboardOrdersToCsv } = useGetExport();
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

  for (let i = moment().quarter(); i >= 1; i--) {
    ranges.push(
      {
        label: `Q${i} ${moment().year()}`,
        value: [moment().quarter(i).startOf('quarter').startOf('day').toDate(), moment().quarter(i).endOf('quarter').endOf('day').toDate()]
      }
    )
  }

  for (let i = moment().year(); i >= 2022; i--) {
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
    if (startDate.year() != endDate.year()) {
      toast.warning("Invalid selection: selected dates must both be in the same year");
      return;
    }
    const dashboardSelection = { ...currentDashboardSelection };
    dashboardSelection.start = selectedStart;
    dashboardSelection.end = selectedEnd;
    dispatch(setDashboardDateRange(dashboardSelection));
  };

  const exportDashboardData = () => {
    const dashboardSelection = { ...currentDashboardSelection };
    if (
      !dashboardSelection.currentDashboardData ||
      !dashboardSelection.start ||
      !dashboardSelection.end
    ) {
      return;
    }

    getAllOrders(dashboardSelection.start, dashboardSelection.end).then(
      (response: GetOrdersResponse) => {
        if (response.orders && !response.orderError) {
          if (dashboardSelection.currentDashboardData) {
            dashboardSelection.currentDashboardData.orders = response.orders;
            const csvData = exportDashboardOrdersToCsv(dashboardSelection);
            const fileName = getFileNameFromDashboardReportSelection(
              'dashboard-orders',
              dashboardSelection,
            );
            downloadFile(fileName, csvData);
            dispatch(setCurrentDashboardData(dashboardSelection.currentDashboardData));
          }
        }
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
