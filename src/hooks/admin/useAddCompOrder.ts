import { ModifyOrderResponse } from '@/types/event';
import { eventService } from '../../services';

export const useAddCompedOrder = () => {
  const addCompedOrder = async (
    eventId: number,
    numTickets: number,
  ): Promise<ModifyOrderResponse> =>
    await eventService.addCompedOrder(eventId, numTickets);

  return { addCompedOrder };
};
