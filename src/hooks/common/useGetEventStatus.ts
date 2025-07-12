import { Seller, VipEvent } from '@/types/event';
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
    } else if (event.isSoldOut) {
      statusSlug = 'sold-out';
    } else {
      if (event.announceDate || event.tourAnnounceDate) {
        const announceDate = event.announceDate
          ? moment(event.announceDate).unix()
          : moment(event.tourAnnounceDate).unix();
        if (announceDate > moment().unix()) {
          statusSlug = 'active-pending';
        } else {
          statusSlug = 'active';
        }
      } else {
        statusSlug = 'active';
      }
    }
    return statusSlug;
  };

  const getSellerStatusSlug = (seller: Seller | undefined): string => {
    let statusSlug: string = '';
    if (!seller) {
      return '';
    }
    if (!seller.isActive) {
      statusSlug = 'inactive';
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
      case 'sold-out':
        statusText = 'SOLD OUT';
        break;
      case 'active':
      case 'active-pending':
        statusText = 'Active';
        let announceDate: moment.Moment;
        if (vipEvent && (vipEvent.announceDate || vipEvent.tourAnnounceDate)) {
          announceDate = vipEvent.announceDate
            ? moment(vipEvent.announceDate)
            : moment(vipEvent.tourAnnounceDate);
          if (announceDate.unix() > moment().unix()) {
            statusText += ` - Announce Date ${announceDate.format('MM/DD/YYYY')}`;
          }
        }
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
    if (slug != 'sold-out' && (vipEvent?.isSoldOut ?? false)) {
      statusText += ' - SOLD OUT';
    }
    return statusText;
  };

  return { getEventStatusSlug, getEventStatusText, getSellerStatusSlug };
};
