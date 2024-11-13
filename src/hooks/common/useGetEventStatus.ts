import { VipEvent } from '@/types/event';

export const useGetEventStatus = () => {
  const getEventStatusSlug = (event: VipEvent | undefined): string => {
    let statusSlug: string = '';
    if (!event) {
      return '';
    }
    if (event.isDeleted) {
      statusSlug = 'deleted';
    } else if (event.isCancelled) {
      statusSlug = 'cancelled';
    } else if (!event.isActive) {
      statusSlug = 'inactive';
    } else if (event.isHidden) {
      statusSlug = 'hidden';
    } else {
      statusSlug = 'active';
    }
    return statusSlug;
  };

  const getEventStatusText = (vipEvent: VipEvent | undefined): string => {
    const slug = getEventStatusSlug(vipEvent);
    let statusText: string = '';
    switch (slug) {
      case 'deleted':
        statusText = 'Deleted';
        break;
      case 'cancelled':
        statusText = 'Cancelled';
        break;
      case 'inactive':
        statusText = 'Inactive';
        break;
      case 'hidden':
        statusText = 'Hidden';
        break;
      case 'active':
        statusText = 'Active';
        break;
      default:
        break;
    }
    return statusText;
  };

  return { getEventStatusSlug, getEventStatusText };
};
