import { eventService } from "../../services";
import { GetDashboardOrdersResponse } from "@/types/event";

export const useGetDashboardData = () => {
  const getDashboardData = async (): Promise<GetDashboardOrdersResponse> => {
    let response: GetDashboardOrdersResponse = {
        totals: undefined,
        dashError: undefined
    };

    response = await eventService.getDashboardOrderData()

    return response;    
  };

  return { getDashboardData };
};