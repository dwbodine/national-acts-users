import { ITicketData, ITicketSalesData, ITicketTypeData, VipEvent } from '@/types/event';
import moment from 'moment';

export function getPurchaseDataFromEvents(events: VipEvent[]): ITicketSalesData[] {
  let map = new Map<string, ITicketSalesData>();
  events?.forEach((evt) => {
    evt.orders?.forEach((order) => {
      if (order.isActive && !order.isDeleted) {
        const key = moment(order.purchaseDate).format('YYYY-MM-DD');
        let salesData = map.get(key);
        if (!salesData) {
          const data: ITicketSalesData = {
            PurchaseDate: moment(key).format('MM/DD/YYYY'),
            Tickets: order.numTickets,
            Purchases: 1,
            Revenue: order.revenueUsd,
            ServiceFees: order.serviceFees ?? 0,
            TotalRevenue: order.revenueUsd + (order.serviceFeesUsd ?? 0),
          };
          map.set(key, data);
        } else {
          salesData.Purchases += 1;
          salesData.Tickets += order.numTickets;
          salesData.Revenue += order.revenueUsd;
          salesData.ServiceFees += order.serviceFees ?? 0;
          (salesData.TotalRevenue += order.revenueUsd + (order.serviceFeesUsd ?? 0)),
            map.set(key, salesData);
        }
      }
    });
  });

  let ticketSalesData: ITicketSalesData[] = [];
  if (map.size > 0) {
    var keys = Array.from(map.keys()).sort();
    var start = moment(keys[0]);
    var end = moment(keys[keys.length - 1]);
    while (start.unix() <= end.unix()) {
      const key = start.format('YYYY-MM-DD');
      let salesData = map.get(key);
      if (!salesData) {
        const data: ITicketSalesData = {
          PurchaseDate: moment(key).format('MM/DD/YYYY'),
          Tickets: 0,
          Purchases: 0,
          Revenue: 0,
          ServiceFees: 0,
          TotalRevenue: 0,
        };
        ticketSalesData.push(data);
      } else {
        ticketSalesData.push(salesData);
      }
      start = start.add(1, 'days');
    }
  }

  return ticketSalesData;
}
