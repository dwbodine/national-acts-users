export function exportEventsToCsv = (
    events: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
  ): string => {
    if (!events || events.length == 0) {
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
            (x) => x.TicketType == ticketType.ticketTypeName,
          );
          let number = arr.get(ticketType.ticketTypeName) ?? 0;
          if (data) {
            number += data.Number;
          }
          arr.set(ticketType.ticketTypeName, number);
        });
      });
      for (const ticketType in arr.keys) {
        exportStr += `"${ticketType}","${arr.get(ticketType)}"\n`;
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
      const sellerName = vipEvent.sellerName;
      const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
      const title = vipEvent.title;
      let venue = '';
      let location = '';
      if (vipEvent.venue) {
        venue = vipEvent.venue.name;
        location = this.getLocationInfoFromVenue(vipEvent.venue);
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

  getOrderExportTableHeader = (
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

  getOrderExportTableFromEvent = (
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
        exportStr += this.getOrderExportRow(
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

  getOrderExportRow = (
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
    const email = order.email;
    let phone = '';
    if (order.phone) {
      phone = order.phone;
    }
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
      const orderId = order.orderId;
      const orderStatus = this.getOrderStatusText(order);
      const eventDate = moment(order.eventDate).format('MM/DD/YYYY');
      const eventName = order.eventTitle;
      const sellerName = order.sellerName;
      const numTickets = order.numTickets;
      const originalPrice = order.revenue?.toFixed(2) ?? 0;
      const originalServiceFees = order.serviceFees?.toFixed(2) ?? 0;
      const exchangeRate = order.exchangeRate;
      const revenue = order.revenueUsd?.toFixed(2) ?? 0;
      const serviceFees = order.serviceFeesUsd?.toFixed(2) ?? 0;
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
          if (order.currencyAbbrev != 'USD' && order.currencySymbol != '$') {
            exportStr += `,"${originalPrice} ${order.currencySymbol}","${exchangeRate}"`;
          } else {
            exportStr += `,"${originalPrice}","${exchangeRate}"`;
          }
        }
        if (viewServiceFees) {
          if (order.currencyAbbrev != 'USD' && order.currencySymbol != '$') {
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

  exportCustomerDataToCsv = (
    events: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    currencyAbbrev?: string,
  ): string => {
    if (!events || events.length == 0) {
      return '';
    }

    let exportStr = this.getOrderExportTableHeader(
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      currencyAbbrev,
    );

    events.forEach((vipEvent: VipEvent) => {
      exportStr += this.getOrderExportTableFromEvent(
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

  exportEventCustomerDataToCsv = (
    vipEvent: VipEvent,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasNonUsaOrders: boolean,
    currencyAbbrev?: string,
    showOnlyEmails?: boolean,
    showOnlyPhones?: boolean,
  ): string => {
    if (!vipEvent || !vipEvent?.orders || vipEvent.orders.length == 0) {
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
            (x) => x.TicketType == ticketType.ticketTypeName,
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

    exportStr += this.getOrderExportTableHeader(
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
    exportStr += this.getOrderExportTableFromEvent(
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

  exportDashboardOrdersToCsv = (
    currentDashboardSelection: AdminDashboardSelection,
  ): string => {
    if (
      !currentDashboardSelection.currentDashboardData ||
      !currentDashboardSelection.currentDashboardData.orders ||
      currentDashboardSelection.currentDashboardData.orders.length == 0
    ) {
      return '';
    }

    const orders = currentDashboardSelection.currentDashboardData.orders;
    const startDate = moment.unix(currentDashboardSelection.start).format('M/D/YYYY');
    const endDate = moment.unix(currentDashboardSelection.end).format('M/D/YYYY');

    let exportStr = `"Admin dashboard - orders from ${startDate} to ${endDate}"\n\n`;

    let hasShirtData = false;
    let hasPhoneData = false;
    let hasNonUsaOrders = false;
    for (const order of orders) {
      if (order.phone && order.phone != '') {
        hasPhoneData = true;
      }
      if (order.totalShirts ?? 0 > 0) {
        hasShirtData = true;
      }
      if (order.currencyAbbrev != 'USD') {
        hasNonUsaOrders = true;
      }
      if (hasPhoneData && hasShirtData && hasNonUsaOrders) {
        break;
      }
    }

    exportStr += this.getOrderExportTableHeader(
      true,
      true,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      '',
      true,
    );

    orders.forEach((order: Order) => {
      exportStr += this.getOrderExportRow(
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

  getLocationInfoFromVenue = (venue: Venue): string => {
    let location = `${venue.city}`;
    if (venue.state && venue.state.trim() != '') {
      location += `, ${venue.state}`;
    }
    if (
      venue.country &&
      venue.country.countryName &&
      venue.country.countryId != DEFAULT_COUNTRY_ID
    ) {
      location += ', ' + venue.country.countryName;
    }
    return location;
  };

  getAddressFromExternalVenue = (venue: ExternalVenue): string => {
    let location = `${venue.address}, ${venue.city}`;
    if (venue.state && venue.state.trim() != '') {
      location += `, ${venue.state}`;
    }
    if (venue.zipCode && venue.zipCode.trim() != '') {
      location += ` ${venue.zipCode}`;
    }
    if (
      venue.country &&
      venue.country.countryName &&
      venue.country.countryId != DEFAULT_COUNTRY_ID
    ) {
      location += ', ' + venue.country.countryName;
    }
    return location;
  };

  getLocationInfoFromDailyOrderData = (order: IDailyOrderData): string => {
    let location = `${order.city}`;
    if (order.state && order.state.trim() != '') {
      location += `, ${order.state}`;
    }
    if (
      order.country &&
      order.country != 'United States' &&
      order.country != 'USA' &&
      order.state &&
      order.country.trim() != order.state.trim()
    ) {
      location += ', ' + order.country;
    }
    return location;
  };

  getAccountNameFromTicketSocketId = (ticketSocketId: number): string => {
    let accountName = '';
    switch (ticketSocketId) {
      case 2:
        accountName = 'European VIP Tickets';
        break;
      case 3:
        accountName = 'Australian VIP tickets';
        break;
      case 4:
        accountName = 'USA Concert tickets';
        break;
      case 5:
        accountName = 'Japanese VIP Tickets';
        break;
      default:
        accountName = 'USA VIP Tickets';
        break;
    }
    return accountName;
  };

  getOrderStatusSlug = (order: Order | undefined): string => {
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

  getOrderStatusText = (order: Order | undefined): string => {
    const slug = this.getOrderStatusSlug(order);
    let statusText: string = '';
    let activeTicket: Ticket | undefined = undefined;
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
        activeTicket = order?.tickets?.find((x) => !x.isRefunded);
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
}
