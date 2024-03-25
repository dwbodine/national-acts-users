import { eventService } from "../services";
import { VipEvent } from "@/types/event";

export const useGetExport = () => {
  const exportEventsToCsv = (vipEvents: VipEvent[]): string => {
    return eventService.exportEventsToCsv(vipEvents);
  };

  const exportEventCustomerDataToCsv = (vipEvent: VipEvent, hasPhoneData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportEventCustomerDataToCsv(vipEvent, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
  };

  const exportCustomerDataToCsv = (vipEvents: VipEvent[], hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportCustomerDataToCsv(vipEvents, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev)
  };

  return { exportEventsToCsv, exportEventCustomerDataToCsv, exportCustomerDataToCsv };
};