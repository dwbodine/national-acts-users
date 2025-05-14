import { AdminDashboardSelection } from '@/types/user';
import { eventService } from '../../services';
import { VipEvent } from '@/types/event';

export const useGetExport = () => {
  const exportEventsToCsv = (
    vipEvents: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
  ): string => {
    return eventService.exportEventsToCsv(vipEvents, viewServiceFees, showRevenueData);
  };

  const exportEventCustomerDataToCsv = (
    vipEvent: VipEvent,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasNonUsaOrders: boolean,
    currencySymbol?: string,
    showOnlyEmails?: boolean,
    showOnlyPhones?: boolean,
  ): string => {
    return eventService.exportEventCustomerDataToCsv(
      vipEvent,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasNonUsaOrders,
      currencySymbol,
      showOnlyEmails,
      showOnlyPhones,
    );
  };

  const exportCustomerDataToCsv = (
    vipEvents: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    currencySymbol?: string,
  ): string => {
    return eventService.exportCustomerDataToCsv(
      vipEvents,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      currencySymbol,
    );
  };

  const exportDashboardOrdersToCsv = (
    currentDashboardSelection: AdminDashboardSelection,
  ): string => {
    return eventService.exportDashboardOrdersToCsv(currentDashboardSelection);
  };

  return {
    exportEventsToCsv,
    exportEventCustomerDataToCsv,
    exportCustomerDataToCsv,
    exportDashboardOrdersToCsv,
  };
};
