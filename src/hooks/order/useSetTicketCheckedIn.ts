import { eventService } from '../../services';
import { ModifyTicketResponse } from '@/types/event';

export const useSetTicketCheckedIn = () => {
  const setTicketCheckedIn = async (
    ticketSocketOrderTicketId: number,
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> => {
    return await eventService.setTicketCheckedIn(ticketSocketOrderTicketId, isCheckedIn);
  };

  return { setTicketCheckedIn };
};
