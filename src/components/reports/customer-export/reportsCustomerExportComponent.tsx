'use client';

import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { useLogActivityData } from '@/hooks/common/useLogActivityData';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { setReportDates } from '@/lib/adminReportsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import { GetEventsResponse } from '@/types/responses';
import { UserActivityType } from '@/types/user';
import { downloadCsvFile } from '@/utils/downloadFile';
import { exportCustomerDataToCsv } from '@/utils/eventUtils';
import getFileNameFromReportAdminSelection from '@/utils/getFileNameFromAdminReportSelection';

import ReportDatePicker from '../../common/reportDatePickerControl';

export default function ReportsCustomerExport() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentAdminReportSelection = useSelector((state: RootState) => state.adminReportSelection);
  const dispatch = useDispatch();
  const { getAllEvents } = useGetAllEvents();
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    // Do nothing, just refresh
  }, [currentAdminReportSelection, globalSelection.isLoading]);

  const onDateChange = (newStart: number, newEnd: number) => {
    const reportSelection = { ...currentAdminReportSelection };
    reportSelection.start = newStart;
    reportSelection.end = newEnd;
    dispatch(setReportDates(reportSelection));
  };

  const exportCustomerData = (vipEvents: VipEvent[] | undefined) => {
    if (vipEvents && vipEvents.length > 0) {
      const hasPhoneData = vipEvents.find((x) => x.hasPhoneData === true) !== undefined;
      const hasShirtData = vipEvents.find((x) => x.hasShirtData === true) !== undefined;
      const hasNonUsaOrders = vipEvents.find((x) => x.hasNonUSAOrders === true) !== undefined;
      let currencySymbol: string | undefined = undefined;
      if (hasNonUsaOrders) {
        const symbolOrder = vipEvents.find((x) => x.hasNonUSAOrders === true);
        if (symbolOrder !== undefined) {
          currencySymbol = symbolOrder.nonUsaCurrencySymbol;
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
      downloadCsvFile(fileName, csvData);
    } else {
      toast.warning('No events found');
    }
  };

  const onSubmit = () => {
    if (
      currentAdminReportSelection &&
      currentAdminReportSelection.start &&
      currentAdminReportSelection.end
    ) {
      const { start, end } = currentAdminReportSelection;

      if (start >= end) {
        toast.warning('Start date must be before end date');
        return;
      }

      if (start < MINIMUM_UNIX_TIMESTAMP) {
        const minDate = moment.unix(MINIMUM_UNIX_TIMESTAMP).format('MM/DD/YYYY');
        toast.warning(`Start date must be on or before ${minDate}`);
        return;
      }

      dispatch(setIsLoading(true));
      void logActivityData(UserActivityType.CustomerExportReport).then(() => {
        void getAllEvents(start, end).then((response: GetEventsResponse) => {
          if (response && !response.error) {
            exportCustomerData(response.events);
          } else {
            toast.error(response.error ?? 'Unknown error occurred');
          }
          dispatch(setIsLoading(false));
        });
      });
    } else {
      toast.warning('No dates selected');
    }
  };

  return (
    <>
      <PageHeader pageTitle="Export Customer Data" />
      <div className="admin-container">
        <ReportDatePicker
          OnChange={onDateChange}
          Start={currentAdminReportSelection.start}
          End={currentAdminReportSelection.end}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </>
  );
}
