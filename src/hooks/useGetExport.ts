import { eventService } from "../services";
import { VipEvent } from "@/types/event";

export const useGetExport = () => {
  const exportEventsToCsv = (vipEvents: VipEvent[], isAdmin: boolean): string => {
    return eventService.exportEventsToCsv(vipEvents, isAdmin);
  };

  const exportEventCustomerDataToCsv = (vipEvent: VipEvent, isAdmin: boolean, hasPhoneData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportEventCustomerDataToCsv(vipEvent, isAdmin, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
  };

  const exportCustomerDataToCsv = (vipEvents: VipEvent[], isAdmin: boolean, hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    return eventService.exportCustomerDataToCsv(vipEvents, isAdmin, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev)
  };

  return { exportEventsToCsv, exportEventCustomerDataToCsv, exportCustomerDataToCsv };
};