import { VipEvent } from '@/types/event';
import moment from 'moment';

export const useGetEventStatus = () => {
  const getEventStatusSlug = (
    event: VipEvent | undefined,
    isAdmin: boolean = false,
  ): string => {
    let statusSlug: string = '';
    if (!event) {
      return '';
    }
    if (
      isAdmin &&
      event.emailSentToVips &&
      event.textSentToVips &&
      event.listSentToBand
    ) {
      statusSlug = 'taskscomplete';
    } else if (
      isAdmin &&
      event.totalTickets == 0 &&
      moment(event.eventDate).valueOf() <= moment().valueOf()
    ) {
      statusSlug = 'zerovips';
    } else if (event.isDeleted) {
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

  const getEventStatusText = (
    vipEvent: VipEvent | undefined,
    isAdmin: boolean = false,
  ): string => {
    const slug = getEventStatusSlug(vipEvent, isAdmin);
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
      case 'taskscomplete':
        statusText = 'All Tasks Complete';
        break;
      case 'zerovips':
        statusText = 'No VIPs Sold';
        break;
      default:
        break;
    }
    return statusText;
  };

  return { getEventStatusSlug, getEventStatusText };
};
