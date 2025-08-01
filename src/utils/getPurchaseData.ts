import { ITicketSalesData, VipEvent } from '@/types/event';
import moment from 'moment';

export default function getPurchaseDataFromEvents (events: VipEvent[]): ITicketSalesData[] {
  const map = new Map<string, ITicketSalesData>();
  events?.forEach((evt) => {
    evt.orders?.forEach((order) => {
      if (order.isActive && !order.isDeleted) {
        const key = moment(order.purchaseDate).format('YYYY-MM-DD');
        const salesData = map.get(key);
        if (salesData === undefined) {
          const data: ITicketSalesData = {
            PurchaseDate: moment(key).format('MM/DD/YYYY'),
            Purchases: 1,
            Revenue: order.revenueUsd,
            ServiceFees: order.serviceFees ?? 0,
            Tickets: order.numTickets,
            TotalRevenue: order.revenueUsd + (order.serviceFeesUsd ?? 0),
          };
          map.set(key, data);
        } else {
          salesData.Purchases += 1;
          salesData.Tickets += order.numTickets;
          salesData.Revenue += order.revenueUsd;
          salesData.ServiceFees += order.serviceFees ?? 0;
          salesData.TotalRevenue += (order.revenueUsd ?? 0) + (order.serviceFeesUsd ?? 0);
          map.set(key, salesData);
        }
      }
    });
  });

  const ticketSalesData: ITicketSalesData[] = [];
  if (map.size > 0) {
    const keys = Array.from(map.keys()).sort();
    let start = moment(keys[0]);
    const end = moment(keys[keys.length - 1]);
    while (start.unix() <= end.unix()) {
      const key = start.format('YYYY-MM-DD');
      const salesData = map.get(key);
      if (salesData === undefined) {
        const data: ITicketSalesData = {
          PurchaseDate: moment(key).format('MM/DD/YYYY'),
          Purchases: 0,
          Revenue: 0,
          ServiceFees: 0,
          Tickets: 0,
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
