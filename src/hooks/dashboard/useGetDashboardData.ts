import { AdminDashboardSelection } from "@/types/user";
import { eventService } from "../../services";
import { GetDashboardOrdersResponse } from "@/types/event";

export const useGetDashboardData = () => {
  const getDashboardData = async (currentDashboardSelection: AdminDashboardSelection): Promise<GetDashboardOrdersResponse> => {
    let response: GetDashboardOrdersResponse = {
        totals: undefined,
        dashError: undefined
    };

    response = await eventService.getDashboardOrderData(currentDashboardSelection)

    return response;    
  };

  return { getDashboardData };
};