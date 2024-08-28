import axios, { AxiosInstance } from "axios";
import { VipEvent, GetEventsResponse, ModifyEventResponse, ModifyOrderResponse, ITicketData, ITicketTypeData, Order, IShirtSizeData, Venue, TicketType, ModifyTicketResponse } from "../types/event";
import { UserReportSelection } from "@/types/user";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import moment from "moment";
import { getShirtDataFromEvents } from "@/utils/getShirtData";

export class EventService {
  protected readonly instance: AxiosInstance;
  protected readonly eventUrl: string;
  
  public constructor(url: string, eUrl: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
    this.eventUrl = eUrl;
  }

  getEvents = async (reportSelection: UserReportSelection): Promise<GetEventsResponse> => {
    let url = `/user/eventsAndOrdersSecured?excludeExternal=1&sellerId=${reportSelection.seller.sellerId}`;

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    if (reportSelection.showInactive) {
      url += '&inactive=1';
    }

    if (reportSelection.showDeleted) {
      url += '&deleted=1';
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? events as VipEvent[] : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while fetching events - please contact your administrator";
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getEventDetail = async (eventId: number, reportSelection: UserReportSelection): Promise<GetEventsResponse> => {
    let url = `/user/eventsAndOrdersSecured?excludeExternal=1&tsEventId=${eventId}`;

    if (reportSelection.showInactiveOrders) {
      url += '&inactive=1';
    }

    if (reportSelection.showDeletedOrders) {
      url += '&deleted=1';
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? events as VipEvent[] : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while fetching events - please contact your administrator";
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  setEventInactive = async(eventId: number, isActive: boolean): Promise<ModifyEventResponse> => {
    const url = "/user/setEventInactiveSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200
    };

    const data = {
      'eventId': eventId,
      'isActive': isActive ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.eventError = "Unexpected error occurred while modifying event - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying event - please contact your administrator";
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setEventDeleted = async(eventId: number, isDeleted: boolean): Promise<ModifyEventResponse> => {
    const url = "/user/setEventDeletedSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200
    };

    const data = {
      'eventId': eventId,
      'isDeleted': isDeleted ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.eventError = "Unexpected error occurred while modifying event - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying event - please contact your administrator";
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setOrderInactive = async(orderId: number, isActive: boolean): Promise<ModifyOrderResponse> => {
    const url = "/user/setOrderInactiveSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200
    };

    const data = {
      'orderId': orderId,
      'isActive': isActive ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.orderError = "Unexpected error occurred while modifying order - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying order - please contact your administrator";
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

  setOrderDeleted = async(orderId: number, isDeleted: boolean): Promise<ModifyOrderResponse> => {
    const url = "/user/setOrderDeletedSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200
    };

    const data = {
      'orderId': orderId,
      'isDeleted': isDeleted ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.orderError = "Unexpected error occurred while modifying order - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying order - please contact your administrator";
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

  setTicketCheckedIn = async(ticketId: number, isCheckedIn: boolean): Promise<ModifyTicketResponse> => {
    const url = "/user/setTicketCheckinSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyTicketResponse = {
      success: false,
      ticketError: undefined,
      statusCode: 200
    };

    const data = {
      'ticketId': ticketId,
      'isCheckedIn': isCheckedIn ? 1 : 0
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.ticketError = "Unexpected error occurred while modifying ticket - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying ticket - please contact your administrator";
        }
        modifyResponse.ticketError = errorMessage;
        return modifyResponse;
      });
  };

  getEventUrl = (): string => {
    return this.eventUrl;
  }

  exportEventsToCsv = (events: VipEvent[], viewServiceFees: boolean, showRevenueData: boolean): string => {
    if (!events || events.length == 0) {
      return '';
    }

    let exportStr = `"Summary"\n"Shows Listed:","${events.length}"\n`;

    const ticketData: ITicketData = getTicketDataFromEvents(events);
    const ticketTypes = ticketData?.TicketTypes;
    if (ticketTypes?.length > 0) {
      exportStr += '"Ticket Types sold:"\n';
      let arr: any = [];
      ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
        ticketTypes.forEach((ticketType: TicketType) => {
          var data = ticketTypeData.find(x => x.TicketType == ticketType.ticketTypeName);
          var number = arr[ticketType.ticketTypeName] ?? 0;
          if (data) {
              number += data.Number;
          }
          arr[ticketType.ticketTypeName] = number;
        });
      });
      for (const ticketType in arr) {
        exportStr += `"${ticketType}","${arr[ticketType]}"\n`;
      }
    }

    exportStr += '"Date","Title","Venue","Location","Tickets sold",';
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
    let totalServiceFees = 0.0;

    events.forEach((vipEvent: VipEvent) => {
      const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
      const title = vipEvent.title;
      let venue = '';
      let location = '';
      if (vipEvent.venue) {
          venue = vipEvent.venue.name;
          location = this.getLocationInfoFromVenue(vipEvent.venue);
      }
      const ticketsSold = vipEvent.totalTickets;
      totalTcketsSold += ticketsSold;
      const revenue = vipEvent.totalRevenue;
      const serviceFees = vipEvent.totalServiceFees;
      totalRevenue += revenue;
      exportStr += `"${eventDate}","${title}","${venue}","${location}","${ticketsSold}",`;
      if (showRevenueData) {
        exportStr += `"${revenue.toFixed(2)}",`;
      }      
      if (viewServiceFees) {
        exportStr += `"${serviceFees.toFixed(2)}"\n`;
      } else {
        exportStr += '\n';
      }
    });

    exportStr += `"Total","","","","${totalTcketsSold}",`;
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

  getOrderExportTableHeader = (viewServiceFees: boolean, showRevenueData: boolean, hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencyAbbrev?: string): string => {
    let exportStr = '"Purchaser Name","Purchaser Zip","Attendee Name(s)","Purchase Date","Event Date","Event Name","Ticket Type","Number of tickets"';
    if (hasNonUsaOrders) {
      if (showRevenueData) {
        exportStr += `,"Original Price (${currencyAbbrev})","Exchange Rate (${currencyAbbrev} to USD)"`;
      }      
      if (viewServiceFees) {
        exportStr += `,"Original Service Fees (${currencyAbbrev})"`;
      }
    }
    if (showRevenueData) {
      exportStr += ',"Revenue (USD)"';
    }    
    if (viewServiceFees) {
      exportStr += ',"Service Fees (USD)"';
    }
    exportStr += ',"Email"';
    if (hasPhoneData) {
      exportStr += ',"Phone"';
    }
    if (hasShirtData) {
      exportStr += ',"Shirt Sizes"';
    }
    exportStr += "\n";
    return exportStr;
  }

  getOrderExportTableFromEvent = (vipEvent: VipEvent, viewServiceFees: boolean, showRevenueData: boolean, hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string) : string => {
    let exportStr = '';
    if (vipEvent.orders && vipEvent.orders.length > 0) {
        vipEvent.orders.forEach((order: Order) => {
          const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
          const purchaserZip = order.purchaserZipCode ?? '';
          const attendeeNames = order.attendeeNames?.join(" / ");
          const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
          const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
          const eventName = vipEvent.title;          
          const numTickets = order.numTickets;
          const originalPrice = order.revenue?.toFixed(2) ?? 0;
          const originalServiceFees = order.serviceFees?.toFixed(2) ?? 0;
          const exchangeRate = order.exchangeRate;
          const revenue = order.revenueUsd?.toFixed(2) ?? 0;
          const serviceFees = order.serviceFeesUsd?.toFixed(2) ?? 0;
          const email = order.email;
          let phone = '';
          if (order.phone) {
            phone = order.phone;
          }
          const shirts = order.shirts?.join(' / ') ?? '';
          let ticketTypeStr = '';
          if (numTickets > 0) {
            
            const ticketMap = new Map<string, number>();
            order.tickets?.forEach((ticket) => {
                const item = ticketMap.get(ticket.ticketType);
                let num: number = 1;
                if (item && item > 0) {
                    num = item + 1;
                } 
                ticketMap.set(ticket.ticketType, num);                  
            });
            ticketMap.forEach((value: Number, key: string) => {
              if (ticketTypeStr.length > 0) {                
                ticketTypeStr += " / ";
              }
              ticketTypeStr += `${key} (${value})`;
            });
          } 
          
          exportStr += `"${purchaserName}","${purchaserZip}","${attendeeNames}","${purchaseDate}","${eventDate}","${eventName}","${ticketTypeStr}","${numTickets}"`;
          if (hasNonUsaOrders) {
            if (showRevenueData) {
              exportStr += `,"${originalPrice} ${currencySymbol}","${exchangeRate}"`;
            }            
            if (viewServiceFees) {
              exportStr += `,"${originalServiceFees} ${currencySymbol}"`;
            }
          }
          if (showRevenueData) {
            exportStr += `,"${revenue}"`;
          }          
          if (viewServiceFees) {
            exportStr += `,"${serviceFees}"`;
          }
          exportStr += `,"${email}"`;
          if (hasPhoneData) {
            exportStr += `,"${phone}"`;
          }
          if (hasShirtData) {
            exportStr += `,"${shirts}"`;
          }
          exportStr += '\n';
        });
    }
    return exportStr;
  }

  exportCustomerDataToCsv = (events: VipEvent[], viewServiceFees: boolean, showRevenueData: boolean, hasPhoneData: boolean, hasShirtData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    if (!events || events.length == 0) {
      return '';
    }

    let exportStr = this.getOrderExportTableHeader(viewServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencyAbbrev);

    events.forEach((vipEvent: VipEvent) => {
      exportStr += this.getOrderExportTableFromEvent(vipEvent, viewServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol);
    });

    return exportStr;
  };

  exportEventCustomerDataToCsv = (vipEvent: VipEvent, viewServiceFees: boolean, showRevenueData: boolean, hasPhoneData: boolean, hasNonUsaOrders: boolean, currencySymbol?: string, currencyAbbrev?: string): string => {
    if (!vipEvent || !vipEvent?.orders || vipEvent.orders.length == 0) {
      return '';
    }

    let exportStr = '';
    let hasShirtData = false;

    const ticketData = getTicketDataFromEvents([vipEvent]);
    const ticketTypes = ticketData?.TicketTypes;
    if (ticketTypes?.length > 0) {
        exportStr += '"Ticket Types Sold:"\n';
        exportStr += '"Type","Number"\n';
        ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
            ticketTypes.forEach((ticketType: TicketType) => {
                var data = ticketTypeData.find(x => x.TicketType == ticketType.ticketTypeName);
                var number = 0;
                if (data) {
                    number = data.Number;
                }
                exportStr += `"${ticketType}","${number}"\n`;
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

    exportStr += this.getOrderExportTableHeader(viewServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencyAbbrev);
    exportStr += this.getOrderExportTableFromEvent(vipEvent, viewServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol);

    return exportStr;
  };

  getLocationInfoFromVenue = (venue: Venue): string => {
    let location = `${venue.city}`; 
    if (venue.state && venue.state.trim() != '') {
      location += `, ${venue.state}`;
    }    
    if (venue.country && venue.country != "United States" && venue.country != "USA" && (venue.state && venue.country.trim() != venue.state.trim())) {
        location += ", " + venue.country;
    }
    return location;
  }

}