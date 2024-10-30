import { Order } from "@/types/event";

export const useGetOrderStatus = () => {
  const getOrderStatusSlug = (order: Order | undefined): string => {
    let statusSlug: string = '';
    if (!order) {
      return '';
    }
    if (order.isDeleted) {
      statusSlug = 'deleted';
    } else if (order.isRefunded) {
      statusSlug = 'refunded';
    } else if (order.isChargedBack) {
      statusSlug = 'charged-back';
    } else if (!order.isActive) {
      statusSlug = 'inactive';
    } else if (order.isHidden) {
      statusSlug = 'hidden';
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
      case 'inactive':
        statusText = "Inactive";
        break;
      case 'hidden':
        statusText = "Hidden";
        break;
      case 'active':
        statusText = "Active";
        break;
      case 'refunded':
        statusText = "Refunded";
        break;
      case 'charged-back':
        statusText = "Charged Back";
        break;
      default:
        break;
    }
    return statusText;
  };

  return { getOrderStatusSlug, getOrderStatusText };
};