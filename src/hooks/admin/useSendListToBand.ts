import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSendListToBand = () => {
  const sendListToBand = async (
    eventId: number,
    isSent: boolean,
  ): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
      success: false,
      eventError: undefined,
    };
    response = await eventService.sendListToBand(eventId, isSent);
    return response;
  };

  return { sendListToBand };
};
