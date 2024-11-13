import { eventService } from '../../services';
import { RefreshHistoryResponse } from '@/types/event';

export const useRefreshEventsFromTicketSocket = () => {
  const refreshEventsFromTicketSocket = async (
    sellerId: number,
    start?: number,
    end?: number,
  ): Promise<RefreshHistoryResponse> => {
    let response: RefreshHistoryResponse = {
      results: undefined,
      refreshError: undefined,
    };
    response = await eventService.refreshEventsFromService(sellerId, start, end);
    return response;
  };

  return { refreshEventsFromTicketSocket };
};
