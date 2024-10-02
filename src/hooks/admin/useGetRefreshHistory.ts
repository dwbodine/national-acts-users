import { eventService } from "../../services";
import { GetRefreshHistoryResponse, RefreshHistoryResponse } from "@/types/event";

export const useGetRefreshHistory = () => {
  const getRefreshHistory = async (): Promise<GetRefreshHistoryResponse> => {
    let response: GetRefreshHistoryResponse = {
        history: [],
        refreshError: undefined
    };
    response = await eventService.getTicketSocketRefreshHistory()
    return response;    
  };

  return { getRefreshHistory };
};