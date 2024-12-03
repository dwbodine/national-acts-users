import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSendListToBand = () => {
  const sendListToBand = async (
    ticketSocketEventId: number,
    isSent: boolean,
  ): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
      success: false,
      eventError: undefined,
    };
    response = await eventService.sendListToBand(ticketSocketEventId, isSent);
    return response;
  };

  return { sendListToBand };
};
