import { ModifyTicketResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useSetTicketsCheckedIn = () => {
  const setTicketsCheckedIn = async (
    ticketPartnerOrderTicketIdList: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> =>
    await eventService.setTicketsCheckedIn(ticketPartnerOrderTicketIdList, isCheckedIn);

  return { setTicketsCheckedIn };
};
