import { AdminDashboardSelection, IDailyOrderData } from '@/types/user';
import {
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  Order,
  Seller,
  TicketType,
  Venue,
  VipEvent,
} from '@/types/event';
import { DEFAULT_COUNTRY_ID } from '@/constants';
import { ExternalVenue } from '@/types/admin';
import getShirtDataFromEvents from './getShirtData';
import getTicketDataFromEvents from './getTicketDataFromEvents';
import moment from 'moment';
import parse from 'html-react-parser';

const getLocationInfoFromVenue = (venue: Venue): string => {
  let location = `${venue.city}`;
  if (venue.state && venue.state.trim() !== '') {
    location += `, ${venue.state}`;
  }
  if (
    venue.country &&
    venue.country.countryName &&
    venue.country.countryId !== DEFAULT_COUNTRY_ID
  ) {
    location += `, ${venue.country.countryName}`;
  }
  return location;
};

const getOrderStatusSlug = (order: Order | undefined): string => {
  if (!order) {
    return '';
  } else if (order.isComped) {
    return 'comped';
  } else if (order.isDeleted) {
    return 'deleted';
  } else if (order.hasRefunds) {
    return 'refunded';
  } else if (order.hasChargebacks) {
    return 'charged-back';
  } else if (!order.isActive) {
    return 'inactive';
  }
  return 'active';
};

const getOrderStatusText = (order: Order | undefined): string => {
  const slug = getOrderStatusSlug(order);
  let statusText: string = '';
  const activeTicket = order?.tickets?.find((x) => !x.isRefunded);
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
      if (activeTicket) {
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

const exportEventsToCsv = (
  events: VipEvent[],
  viewServiceFees: boolean,
  showRevenueData: boolean,
): string => {
  if (!events || events.length === 0) {
    return '';
  }

  let exportStr = `"Summary"\n"Shows Listed:","${events.length}"\n`;

  const ticketData: ITicketData = getTicketDataFromEvents(events);
  const ticketTypes = ticketData?.TicketTypes;
  if (ticketTypes?.length > 0) {
    exportStr += '"Ticket Type breakdown:"\n';
    const arr = new Map<string, number>();
    ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
      ticketTypes.forEach((ticketType: TicketType) => {
        const data = ticketTypeData.find(
          (x) => x.TicketType === ticketType.ticketTypeName,
        );
        let number = arr.get(ticketType.ticketTypeName) ?? 0;
        if (data) {
          number += data.Number;
        }
        arr.set(ticketType.ticketTypeName, number);
      });
    });
    for (const [ticketType, value] of arr.entries()) {
      exportStr += `"${ticketType}","${value}"\n`;
    }
  }

  exportStr += '"Seller Name","Date","Title","Venue","Location","Tickets sold",';
  if (showRevenueData) {
    exportStr += '"Revenue (USD)",';
  }
  if (viewServiceFees) {
    exportStr += '"Service Fees (USD)"\n';
  } else {
    exportStr += '\n';
  }

  let totalTcketsSold = 0;
  let totalRevenue = 0.0;
  const totalServiceFees = 0.0;

  events.forEach((vipEvent: VipEvent) => {
    const { sellerName } = vipEvent;
    const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
    const { title } = vipEvent;
    let venue = '';
    let location = '';
    if (vipEvent.venue) {
      venue = vipEvent.venue.name;
      location = getLocationInfoFromVenue(vipEvent.venue);
    }
    const ticketsSold = vipEvent.totalTickets;
    totalTcketsSold += ticketsSold ?? 0;
    const revenue = vipEvent.totalRevenue;
    const serviceFees = vipEvent.totalServiceFees;
    totalRevenue += revenue ?? 0;
    exportStr += `"${sellerName}","${eventDate}","${title}","${venue}","${location}","${ticketsSold}",`;
    if (showRevenueData) {
      exportStr += `"${(revenue ?? 0).toFixed(2)}",`;
    }
    if (viewServiceFees) {
      exportStr += `"${(serviceFees ?? 0).toFixed(2)}"\n`;
    } else {
      exportStr += '\n';
    }
  });

  exportStr += `"Total","","","","","${totalTcketsSold}",`;
  if (showRevenueData) {
    exportStr += `"${totalRevenue.toFixed(2)}",`;
  }
  if (viewServiceFees) {
    exportStr += `"${totalServiceFees.toFixed(2)}"\n`;
  } else {
    exportStr += '\n';
  }

  return exportStr;
};

const getOrderExportTableHeader = (
  viewServiceFees: boolean,
  showRevenueData: boolean,
  hasPhoneData: boolean,
  hasShirtData: boolean,
  hasNonUsaOrders: boolean,
  currencyAbbrev?: string,
  hideCurrencyInHeaders: boolean = false,
  showOnlyEmails: boolean = false,
  showOnlyPhones: boolean = false,
): string => {
  let exportStr = '';
  if (showOnlyEmails) {
    exportStr += '"Email"\n';
  } else if (showOnlyPhones && hasPhoneData) {
    exportStr += '"Phone"\n';
  } else {
    exportStr =
      '"Seller Name","Purchaser Name","Purchaser Zip","Purchaser IP Address","Attendee Name(s)","Purchase Date","Order Id","Order Status","Event Date","Event Name","Ticket Type","Number of tickets"';
    if (hasNonUsaOrders) {
      if (showRevenueData) {
        if (hideCurrencyInHeaders) {
          exportStr += `,"Original Price","Exchange Rate"`;
        } else {
          exportStr += `,"Original Price (${currencyAbbrev})","Exchange Rate (${currencyAbbrev} to USD)"`;
        }
      }
      if (viewServiceFees) {
        if (hideCurrencyInHeaders) {
          exportStr += `,"Original Service Fees"`;
        } else {
          exportStr += `,"Original Service Fees (${currencyAbbrev})"`;
        }
      }
    }
    if (viewServiceFees) {
      exportStr += ',"Service Fees (USD)"';
    }
    if (showRevenueData) {
      exportStr += ',"Revenue (USD)"';
    }
    exportStr += ',"Email"';
    if (hasPhoneData) {
      exportStr += ',"Phone"';
    }
    if (hasShirtData) {
      exportStr += ',"Shirt Sizes"';
    }
    exportStr +=
      ',"Venue","Event Address","Event City","Event State","Event Zip","Event Country"\n';
  }
  return exportStr;
};

const getOrderExportRow = (
  order: Order,
  viewServiceFees: boolean,
  showRevenueData: boolean,
  hasPhoneData: boolean,
  hasShirtData: boolean,
  hasNonUsaOrders: boolean,
  showOnlyEmails: boolean = false,
  showOnlyPhones: boolean = false,
): string => {
  let exportStr = '';
  const { email, phone, orderId, sellerName, numTickets, exchangeRate } = order;
  if (showOnlyEmails) {
    exportStr += `"${email}"\n`;
  } else if (hasPhoneData && showOnlyPhones) {
    exportStr += `"${phone}"\n`;
  } else {
    const purchaserName =
      order.purchaserLastName || order.purchaserFirstName
        ? `${order.purchaserLastName}, ${order.purchaserFirstName}`
        : '';
    const purchaserZip = order.purchaserZipCode ?? '';
    const purchaserIpAddress = order.purchaserIpAddress ?? '';
    const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
    const orderStatus = getOrderStatusText(order);
    const eventDate = moment(order.eventDate).format('MM/DD/YYYY');
    const eventName = order.eventTitle;
    const originalPrice = (order.revenue ?? 0).toFixed(2);
    const originalServiceFees = (order.serviceFees ?? 0).toFixed(2);
    const revenue = (order.revenueUsd ?? 0).toFixed(2);
    const serviceFees = (order.serviceFeesUsd ?? 0).toFixed(2);
    let shirts = '';
    let ticketTypeStr = '';
    let attendeeNames = '';
    if (numTickets > 0) {
      const ticketMap = new Map<string, number>();
      order.tickets?.forEach((ticket) => {
        if (attendeeNames.length > 0) {
          attendeeNames += ' / ';
        }
        if (shirts.length > 0) {
          shirts += ' / ';
        }
        attendeeNames +=
          ticket.attendeeFirstName || ticket.attendeeLastName
            ? `${ticket.attendeeFirstName} ${ticket.attendeeLastName}`
            : '';
        if (ticket.shirtSize) {
          shirts += ticket.shirtSize;
        }
        const item = ticketMap.get(ticket.ticketType);
        let num: number = 1;
        if (item && item > 0) {
          num = item + 1;
        }
        ticketMap.set(ticket.ticketType, num);
      });
      ticketMap.forEach((value: number, key: string) => {
        if (ticketTypeStr.length > 0) {
          ticketTypeStr += ' / ';
        }
        ticketTypeStr += `${key} (${value})`;
      });
    }

    exportStr += `"${sellerName}","${purchaserName}","${purchaserZip}","${purchaserIpAddress}","${attendeeNames}","${purchaseDate}","${orderId}","${orderStatus}","${eventDate}","${eventName}","${ticketTypeStr}","${numTickets}"`;
    if (hasNonUsaOrders) {
      if (showRevenueData) {
        if (order.currencyAbbrev !== 'USD' && order.currencySymbol !== '$') {
          exportStr += `,"${originalPrice} ${order.currencySymbol}","${exchangeRate}"`;
        } else {
          exportStr += `,"${originalPrice}","${exchangeRate}"`;
        }
      }
      if (viewServiceFees) {
        if (order.currencyAbbrev !== 'USD' && order.currencySymbol !== '$') {
          exportStr += `,"${originalServiceFees} ${order.currencySymbol}"`;
        } else {
          exportStr += `,"${originalServiceFees}"`;
        }
      }
    }
    if (viewServiceFees) {
      exportStr += `,"${serviceFees}"`;
    }
    if (showRevenueData) {
      exportStr += `,"${revenue}"`;
    }
    exportStr += `,"${email}"`;
    if (hasPhoneData) {
      exportStr += `,"${phone}"`;
    }
    if (hasShirtData) {
      exportStr += `,"${shirts}"`;
    }
    exportStr += `,"${order.venue ?? ''}","${order.eventAddress ?? ''}","${order.eventCity ?? ''}","${order.eventState ?? ''}","${order.eventZip ?? ''}","${order.eventCountry ?? ''}"\n`;
  }
  return exportStr;
};

const getOrderExportTableFromEvent = (
  vipEvent: VipEvent,
  viewServiceFees: boolean,
  showRevenueData: boolean,
  hasPhoneData: boolean,
  hasShirtData: boolean,
  hasNonUsaOrders: boolean,
  showOnlyEmails: boolean = false,
  showOnlyPhones: boolean = false,
): string => {
  let exportStr = '';
  if (vipEvent.orders && vipEvent.orders.length > 0) {
    vipEvent.orders.forEach((order: Order) => {
      exportStr += getOrderExportRow(
        order,
        viewServiceFees,
        showRevenueData,
        hasPhoneData,
        hasShirtData,
        hasNonUsaOrders,
        showOnlyEmails,
        showOnlyPhones,
      );
    });
  }
  return exportStr;
};

const exportCustomerDataToCsv = (
  events: VipEvent[],
  viewServiceFees: boolean,
  showRevenueData: boolean,
  hasPhoneData: boolean,
  hasShirtData: boolean,
  hasNonUsaOrders: boolean,
  currencyAbbrev?: string,
): string => {
  if (!events || events.length === 0) {
    return '';
  }

  let exportStr = getOrderExportTableHeader(
    viewServiceFees,
    showRevenueData,
    hasPhoneData,
    hasShirtData,
    hasNonUsaOrders,
    currencyAbbrev,
  );

  events.forEach((vipEvent: VipEvent) => {
    exportStr += getOrderExportTableFromEvent(
      vipEvent,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
    );
  });

  return exportStr;
};

const exportEventCustomerDataToCsv = (
  vipEvent: VipEvent,
  viewServiceFees: boolean,
  showRevenueData: boolean,
  hasPhoneData: boolean,
  hasNonUsaOrders: boolean,
  currencyAbbrev?: string,
  showOnlyEmails?: boolean,
  showOnlyPhones?: boolean,
): string => {
  if (!vipEvent || !vipEvent?.orders || vipEvent.orders.length === 0) {
    return '';
  }

  let exportStr = '';
  let hasShirtData = false;

  const ticketData = getTicketDataFromEvents([vipEvent]);
  const ticketTypes = ticketData?.TicketTypes;
  if (ticketTypes?.length > 0) {
    exportStr += '"Ticket Type breakdown:"\n';
    exportStr += '"Type","Number"\n';
    ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
      ticketTypes.forEach((ticketType: TicketType) => {
        const data = ticketTypeData.find(
          (x) => x.TicketType === ticketType.ticketTypeName,
        );
        let number = 0;
        if (data) {
          number = data.Number;
        }
        exportStr += `"${ticketType.ticketTypeName}","${number}"\n`;
      });
    });
    exportStr += '\n';
  }

  const shirtData = getShirtDataFromEvents([vipEvent]);
  const shirtSizes = shirtData?.ShirtSizes ?? [];
  if (shirtSizes.length > 0) {
    hasShirtData = true;
    exportStr += '"Shirt Totals:"\n';
    exportStr += '"Type","Number"\n';
    shirtData?.ShirtData?.forEach((shirtSizeData: IShirtSizeData[]) => {
      shirtSizeData.forEach((shirtSize) => {
        exportStr += `"${shirtSize.ShirtSize}","${shirtSize.Number}"\n`;
      });
    });
    exportStr += '\n';
  }

  exportStr += getOrderExportTableHeader(
    viewServiceFees,
    showRevenueData,
    hasPhoneData,
    hasShirtData,
    hasNonUsaOrders,
    currencyAbbrev,
    false,
    showOnlyEmails,
    showOnlyPhones,
  );
  exportStr += getOrderExportTableFromEvent(
    vipEvent,
    viewServiceFees,
    showRevenueData,
    hasPhoneData,
    hasShirtData,
    hasNonUsaOrders,
    showOnlyEmails,
    showOnlyPhones,
  );

  return exportStr;
};

const exportDashboardOrdersToCsv = (
  currentDashboardSelection: AdminDashboardSelection,
): string => {
  if (
    !currentDashboardSelection.currentDashboardData ||
    !currentDashboardSelection.currentDashboardData.orders ||
    currentDashboardSelection.currentDashboardData.orders.length === 0
  ) {
    return '';
  }

  const { orders } = currentDashboardSelection.currentDashboardData;
  const startDate = moment.unix(currentDashboardSelection.start).format('M/D/YYYY');
  const endDate = moment.unix(currentDashboardSelection.end).format('M/D/YYYY');

  let exportStr = `"Admin dashboard - orders from ${startDate} to ${endDate}"\n\n`;

  let hasShirtData = false;
  let hasPhoneData = false;
  let hasNonUsaOrders = false;
  for (const order of orders) {
    if (order.phone && order.phone !== '') {
      hasPhoneData = true;
    }
    if ((order.totalShirts ?? 0) > 0) {
      hasShirtData = true;
    }
    if (order.currencyAbbrev !== 'USD') {
      hasNonUsaOrders = true;
    }
    if (hasPhoneData && hasShirtData && hasNonUsaOrders) {
      break;
    }
  }

  exportStr += getOrderExportTableHeader(
    true,
    true,
    hasPhoneData,
    hasShirtData,
    hasNonUsaOrders,
    '',
    true,
  );

  orders.forEach((order: Order) => {
    exportStr += getOrderExportRow(
      order,
      true,
      true,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
    );
  });

  return exportStr;
};

const getAddressFromExternalVenue = (venue: ExternalVenue): string => {
  let location = `${venue.address}, ${venue.city}`;
  if (venue.state && venue.state.trim() !== '') {
    location += `, ${venue.state}`;
  }
  if (venue.zipCode && venue.zipCode.trim() !== '') {
    location += ` ${venue.zipCode}`;
  }
  if (
    venue.country &&
    venue.country.countryName &&
    venue.country.countryId !== DEFAULT_COUNTRY_ID
  ) {
    location += `, ${venue.country.countryName}`;
  }
  return location;
};

const getLocationInfoFromDailyOrderData = (order: IDailyOrderData): string => {
  let location = `${order.city}`;
  if (order.state && order.state.trim() !== '') {
    location += `, ${order.state}`;
  }
  if (
    order.country &&
    order.country !== 'United States' &&
    order.country !== 'USA' &&
    order.state &&
    order.country.trim() !== order.state.trim()
  ) {
    location += `, ${order.country}`;
  }
  return location;
};

const getAccountNameFromTicketSocketId = (ticketSocketId: number): string => {
  switch (ticketSocketId) {
    case 2:
      return 'European VIP Tickets';
      break;
    case 3:
      return 'Australian VIP tickets';
      break;
    case 4:
      return 'USA Concert tickets';
      break;
    case 5:
      return 'Japanese VIP Tickets';
      break;
    default:
      return 'USA VIP Tickets';
      break;
  }
};

const getEventStatusSlug = (
  event: VipEvent | undefined,
  isAdmin: boolean = false,
): string => {
  if (!event) {
    return '';
  }
  if (isAdmin && event.emailSentToVips && event.textSentToVips && event.listSentToBand) {
    return 'taskscomplete';
  } else if (
    isAdmin &&
    event.totalTickets === 0 &&
    moment(event.eventDate).valueOf() <= moment().valueOf()
  ) {
    return 'zerovips';
  } else if (event.isDeleted) {
    return 'deleted';
  } else if (event.isCancelled) {
    return 'cancelled';
  } else if (!event.isActive) {
    return 'inactive';
  } else if (event.isHidden) {
    return 'hidden';
  } else if (event.isSoldOut) {
    return 'sold-out';
  } else if (event.announceDate || event.tourAnnounceDate) {
    const announceDate = event.announceDate
      ? moment(event.announceDate).unix()
      : moment(event.tourAnnounceDate).unix();
    if (announceDate > moment().unix()) {
      return 'active-pending';
    }
    return 'active';
  }

  return 'active';
};

const getSellerStatusSlug = (seller: Seller | undefined): string => {
  if (!seller) {
    return '';
  }
  if (!seller.isActive) {
    return 'inactive';
  }
  return 'active';
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
      if (vipEvent && (vipEvent.announceDate || vipEvent.tourAnnounceDate)) {
        const announceDate = vipEvent.announceDate
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
  if (slug !== 'sold-out' && (vipEvent?.isSoldOut ?? false)) {
    statusText += ' - SOLD OUT';
  }
  return statusText;
};

const formatCurrencyAmount = (
  originalAmount: number | undefined,
  amountUsd: number,
  currencySymbol?: string,
  exchangeRate?: number,
  isAdmin: boolean = false,
) => {
  if (originalAmount && isAdmin) {
    let amount = `${currencySymbol}${originalAmount.toFixed(2)}`;
    if (exchangeRate !== 1 && amountUsd) {
      amount += `<br />($${amountUsd.toFixed(2)})`;
    }
    return parse(amount);
  } else if (amountUsd) {
    return `$${amountUsd.toFixed(2)}`;
  } else if (currencySymbol && isAdmin) {
    return `${currencySymbol}0.00`;
  }
  return '$0.00';
};

export {
  exportCustomerDataToCsv,
  exportDashboardOrdersToCsv,
  exportEventCustomerDataToCsv,
  exportEventsToCsv,
  formatCurrencyAmount,
  getAccountNameFromTicketSocketId,
  getAddressFromExternalVenue,
  getLocationInfoFromDailyOrderData,
  getLocationInfoFromVenue,
  getOrderExportRow,
  getOrderExportTableFromEvent,
  getOrderExportTableHeader,
  getOrderStatusSlug,
  getOrderStatusText,
  getTicketDataFromEvents,
  getEventStatusSlug,
  getEventStatusText,
  getSellerStatusSlug,
};
