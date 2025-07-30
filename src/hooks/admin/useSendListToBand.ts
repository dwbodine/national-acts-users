import { ModifyEventResponse } from '@/types/event';
import { eventService } from '../../services';

export const useSendListToBand = () => {
  const sendListToBand = async (
    eventId: number,
    isSent: boolean,
  ): Promise<ModifyEventResponse> => await eventService.sendListToBand(eventId, isSent);

  return { sendListToBand };
};
