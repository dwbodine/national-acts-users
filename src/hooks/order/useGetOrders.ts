import { AdminDashboardSelection } from "@/types/user";
import { eventService } from "../../services";
import { GetOrdersResponse } from "@/types/event";

export const useGetOrders = () => {
  const getOrders = async (reportSelection: AdminDashboardSelection): Promise<GetOrdersResponse> => {
    let response: GetOrdersResponse = {
        orders: [],
        orderError: undefined
    };

    response = await eventService.getOrders(reportSelection);

    return response;    
  };

  return { getOrders };
};