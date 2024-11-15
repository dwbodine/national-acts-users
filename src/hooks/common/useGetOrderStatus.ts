import { Order } from '@/types/event';

export const useGetOrderStatus = () => {
  const getOrderStatusSlug = (order: Order | undefined): string => {
    let statusSlug: string = '';
    if (!order) {
      return '';
    }
    if (order.isComped) {
      statusSlug = 'comped';
    } else if (order.isDeleted) {
      statusSlug = 'deleted';
    } else if (order.hasRefunds) {
      statusSlug = 'refunded';
    } else if (order.hasChargebacks) {
      statusSlug = 'charged-back';
    } else if (!order.isActive) {
      statusSlug = 'inactive';
    } else {
      statusSlug = 'active';
    }
    return statusSlug;
  };

  const getOrderStatusText = (order: Order | undefined): string => {
    const slug = getOrderStatusSlug(order);
    let statusText: string = '';
    switch (slug) {
      case 'deleted':
        statusText = 'Deleted';
        break;
      case 'comped':
        statusText = 'Comped';
        break;
      case 'inactive':
        statusText = 'Inactive';
        break;
      case 'active':
        statusText = 'Active';
        break;
      case 'refunded':
        const hasActiveTickets = order?.tickets?.find((x) => !x.isRefunded);
        if (hasActiveTickets) {
          statusText = 'Partially Refunded';
        } else {
          statusText = 'Refunded';
        }
        break;
      case 'charged-back':
        statusText = 'Charged Back';
        break;
      default:
        break;
    }
    return statusText;
  };

  return { getOrderStatusSlug, getOrderStatusText };
};
