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

export default function DashboardBar() {
  const dispatch = useDispatch();
  const { getAllOrders } = useGetAllOrders();
  const { exportDashboardOrdersToCsv } = useGetExport();
  const currentDashboardSelection = useSelector(
    (state: RootState) => state.dashboardSelecton,
  );
  const dateRangeTitle = 'Selected date range';

  let pageTitle: string = `Home Dashboard`;

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    let dashboardSelection = { ...currentDashboardSelection };
    dashboardSelection.start = selectedStart;
    dashboardSelection.end = selectedEnd;
    dispatch(setDashboardDateRange(dashboardSelection));
  };

  const exportDashboardData = () => {
    let dashboardSelection = { ...currentDashboardSelection };
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
            dateRangeTitle={dateRangeTitle}
            selectedStart={currentDashboardSelection?.start}
            selectedEnd={currentDashboardSelection?.end}
            disabled={false}
            onDateChange={onDateChange}
          />
          <Button className="dashboard-export-button" onClick={exportDashboardData}>
            Export
          </Button>
        </Col>
      </Row>
    </>
  );
}
