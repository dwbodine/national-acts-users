import { eventService } from '../../services';
import { ModifyOrderResponse } from '@/types/event';

export const useAddCompedOrder = () => {
  const addCompedOrder = async (eventId: number, numTickets: number): Promise<ModifyOrderResponse> => {
    let response: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
    };
    response = await eventService.addCompedOrder(eventId, numTickets);
    return response;
  };

  return { addCompedOrder };
};
