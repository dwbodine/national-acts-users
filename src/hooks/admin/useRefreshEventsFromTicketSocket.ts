import { RefreshHistoryResponse } from '@/types/event';
import { eventService } from '../../services';

export const useRefreshEventsFromTicketSocket = () => {
  const refreshEventsFromTicketSocket = async (
    sellerId: number,
    start?: number,
    end?: number,
  ): Promise<RefreshHistoryResponse> => await eventService.refreshEventsFromService(sellerId, start, end);

  return { refreshEventsFromTicketSocket };
};
