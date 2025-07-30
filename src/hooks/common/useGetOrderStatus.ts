import { Order } from '@/types/event';
import { eventService } from '../../services';

export const useGetOrderStatus = () => {
  const getOrderStatusSlug = (order: Order | undefined): string =>
    eventService.getOrderStatusSlug(order);

  const getOrderStatusText = (order: Order | undefined): string =>
    eventService.getOrderStatusText(order);

  return { getOrderStatusSlug, getOrderStatusText };
};
