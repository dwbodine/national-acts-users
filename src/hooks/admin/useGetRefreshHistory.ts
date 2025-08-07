import { GetRefreshHistoryResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useGetRefreshHistory = () => {
  const getRefreshHistory = async (): Promise<GetRefreshHistoryResponse> =>
    await eventService.getTicketSocketRefreshHistory();

  return { getRefreshHistory };
};
