import { eventService } from "../services";
import { VipEvent } from "@/types/event";

export const useGetExport = () => {
  const exportEventsToCsv = (vipEvents: VipEvent[], viewServiceFees: boolean): string => {
    return eventService.exportEventsToCsv(vipEvents, viewServiceFees);
  };

  const exportEventCustomerDataToCsv = (vipEvent: VipEvent, viewServiceFees: boolean, hasPhoneData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportEventCustomerDataToCsv(vipEvent, viewServiceFees, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
  };

  const exportCustomerDataToCsv = (vipEvents: VipEvent[], viewServiceFees: boolean, hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportCustomerDataToCsv(vipEvents, viewServiceFees, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev)
  };

  return { exportEventsToCsv, exportEventCustomerDataToCsv, exportCustomerDataToCsv };
};