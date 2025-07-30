import { ModifyOrderResponse } from '@/types/event';
import { eventService } from '../../services';

export const useRefundTicket = () => {
  const refundTicket = async (
    ticketId: number,
    refundServiceFees: boolean,
  ): Promise<ModifyOrderResponse> =>
    await eventService.refundTicket(ticketId, refundServiceFees);

  return { refundTicket };
};
