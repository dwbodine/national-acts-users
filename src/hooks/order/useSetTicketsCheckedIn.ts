import { ModifyTicketResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useSetTicketsCheckedIn = () => {
  const setTicketsCheckedIn = async (
    ticketSocketOrderTicketIdList: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> =>
    await eventService.setTicketsCheckedIn(ticketSocketOrderTicketIdList, isCheckedIn);

  return { setTicketsCheckedIn };
};
