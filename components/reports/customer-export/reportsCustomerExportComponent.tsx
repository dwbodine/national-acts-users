import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import ReportDatePicker from '../../common/reportDatePicker';
import ReportsListHomeButton from '../reportsListHomeButton';
import { setReportDates } from '@/lib/adminReportsSelectionSlice';
import { Button } from 'react-bootstrap';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { GetEventsResponse, VipEvent } from '@/types/event';
import { useGetExport } from '@/hooks/common/useGetExport';
import getFileNameFromReportAdminSelection from '@/utils/getFileNameFromAdminReportSelection';
import downloadFile from '@/utils/downloadFile';
import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import moment from 'moment';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { UserActivityType } from '@/types/user';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';

export default function ReportsCustomerExport() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentAdminReportSelection = useSelector(
    (state: RootState) => state.adminReportSelection,
  );
  const dispatch = useDispatch();
  const { getAllEvents } = useGetAllEvents();
  const { logActivityData } = useLogActivityData();
  const { exportCustomerDataToCsv } = useGetExport();

  useEffect(() => {}, [currentAdminReportSelection, globalSelection.isLoading]);

  const onDateChange = (newStart: number, newEnd: number) => {
    const reportSelection = { ...currentAdminReportSelection };
    reportSelection.start = newStart;
    reportSelection.end = newEnd;
    dispatch(setReportDates(reportSelection));
  };

  const onSubmit = () => {
    if (
      currentAdminReportSelection &&
      currentAdminReportSelection.start &&
      currentAdminReportSelection.end
    ) {
      const start = currentAdminReportSelection.start;
      const end = currentAdminReportSelection.end;

      if (start >= end) {
        toast.warning('Start date must be before end date');
        return false;
      }

      if (start < MINIMUM_UNIX_TIMESTAMP) {
        const minDate = moment.unix(MINIMUM_UNIX_TIMESTAMP).format('MM/DD/YYYY');
        toast.warning(`Start date must be on or before ${minDate}`);
        return false;
      }

      dispatch(setIsLoading(true));
      logActivityData(UserActivityType.CustomerExportReport).then(() => {
        getAllEvents(start, end).then((response: GetEventsResponse) => {
          if (response && !response.eventError) {
            exportCustomerData(response.events);
          } else {
            toast.error(response.eventError ?? 'Unknown error occurred');
          }
          dispatch(setIsLoading(false));
        });
      });
    } else {
      toast.warning('No dates selected');
    }
  };

  const exportCustomerData = (vipEvents: VipEvent[] | undefined) => {
    if (vipEvents && vipEvents.length > 0) {
      const hasPhoneData = vipEvents.find((x) => x.hasPhoneData == true) != undefined;
      const hasShirtData = vipEvents.find((x) => x.hasShirtData == true) != undefined;
      const hasNonUsaOrders =
        vipEvents.find((x) => x.hasNonUSAOrders == true) != undefined;
      let currencySymbol: string | undefined = undefined;
      let currencyAbbrev: string | undefined = undefined;
      if (hasNonUsaOrders) {
        const symbolOrder = vipEvents.find((x) => x.hasNonUSAOrders == true);
        if (symbolOrder != undefined) {
          currencySymbol = symbolOrder.nonUsaCurrencySymbol;
          currencyAbbrev = symbolOrder.nonUsaCurrencyAbbrev;
        }
      }
      const showServiceFees = false;
      const showRevenueData = true;
      const csvData = exportCustomerDataToCsv(
        vipEvents,
        showServiceFees,
        showRevenueData,
        hasPhoneData,
        hasShirtData,
        hasNonUsaOrders,
        currencySymbol,
      );
      const fileName = getFileNameFromReportAdminSelection(
        'customer_export',
        currentAdminReportSelection,
      );
      downloadFile(fileName, csvData);
    } else {
      toast.warning('No events found');
    }
  };

  return (
    <div className="admin-container">
      <h3>Export Customer Data</h3>
      <ReportDatePicker
        OnChange={onDateChange}
        Start={currentAdminReportSelection.start}
        End={currentAdminReportSelection.end}
      />
      <Button onClick={onSubmit}>Submit</Button>
      <ReportsListHomeButton />
    </div>
  );
}
