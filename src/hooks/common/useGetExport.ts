import { AdminDashboardSelection } from '@/types/user';
import { VipEvent } from '@/types/event';
import { eventService } from '../../services';

export const useGetExport = () => {
  const exportEventsToCsv = (
    vipEvents: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
  ): string =>
    eventService.exportEventsToCsv(vipEvents, viewServiceFees, showRevenueData);

  const exportEventCustomerDataToCsv = (
    vipEvent: VipEvent,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasNonUsaOrders: boolean,
    currencySymbol?: string,
    showOnlyEmails?: boolean,
    showOnlyPhones?: boolean,
  ): string =>
    eventService.exportEventCustomerDataToCsv(
      vipEvent,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasNonUsaOrders,
      currencySymbol,
      showOnlyEmails,
      showOnlyPhones,
    );

  const exportCustomerDataToCsv = (
    vipEvents: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    currencySymbol?: string,
  ): string =>
    eventService.exportCustomerDataToCsv(
      vipEvents,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      currencySymbol,
    );

  const exportDashboardOrdersToCsv = (
    currentDashboardSelection: AdminDashboardSelection,
  ): string => eventService.exportDashboardOrdersToCsv(currentDashboardSelection);

  return {
    exportCustomerDataToCsv,
    exportDashboardOrdersToCsv,
    exportEventCustomerDataToCsv,
    exportEventsToCsv,
  };
};
