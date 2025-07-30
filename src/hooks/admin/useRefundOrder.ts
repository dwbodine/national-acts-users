import { ModifyOrderResponse } from '@/types/event';
import { eventService } from '../../services';

export const useRefundOrder = () => {
  const refundOrder = async (
    ticketSocketOrderId: number,
    refundServiceFees: boolean,
    markChargeback: boolean = false,
  ): Promise<ModifyOrderResponse> =>
    await eventService.refundOrder(
      ticketSocketOrderId,
      refundServiceFees,
      markChargeback,
    );

  return { refundOrder };
};
