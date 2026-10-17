import { ModifyOrderResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useRefundOrder = () => {
  const refundOrder = async (
    ticketPartnerOrderId: number,
    refundServiceFees: boolean,
    markChargeback: boolean = false,
  ): Promise<ModifyOrderResponse> =>
    await eventService.refundOrder(ticketPartnerOrderId, refundServiceFees, markChargeback);

  return { refundOrder };
};
