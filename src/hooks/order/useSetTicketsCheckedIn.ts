import { eventService } from '../../services';
import { ModifyTicketResponse } from '@/types/event';

export const useSetTicketsCheckedIn = () => {
  const setTicketsCheckedIn = async (
    ticketSocketOrderTicketIdList: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> => {
    return await eventService.setTicketsCheckedIn(
      ticketSocketOrderTicketIdList,
      isCheckedIn,
    );
  };

  return { setTicketsCheckedIn };
};
