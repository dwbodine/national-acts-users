import { eventService } from '../../services';
import { ModifyTicketResponse } from '@/types/event';

export const useSetTicketListCheckedIn = () => {
  const setTicketListCheckedIn = async (
    ticketSocketOrderTicketIds: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> => {
    return await eventService.setTicketListCheckedIn(
      ticketSocketOrderTicketIds,
      isCheckedIn,
    );
  };

  return { setTicketListCheckedIn };
};
