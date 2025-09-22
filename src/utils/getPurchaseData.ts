import { ITicketSalesData, VipEvent } from '@/types/event';
import moment from 'moment';

export default function getPurchaseDataFromEvents(
  events: VipEvent[],
): ITicketSalesData[] {
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
            RevenueChargedBackUsd: order.revenueChargedBackUsd ?? 0,
            RevenueRefundedUsd: order.revenueRefundedUsd ?? 0,
            RevenueUsd: order.revenueUsd,
            ServiceFeeRevenueChargedBackUsd: order.serviceFeeRevenueChargedBackUsd ?? 0,
            ServiceFeeRevenueRefundedUsd: order.serviceFeeRevenueRefundedUsd ?? 0,
            ServiceFeesUsd: order.serviceFees ?? 0,
            Tickets: order.numTickets,
            TicketsChargedBack: order.numTicketsChargedBack ?? 0,
            TicketsRefunded: order.numTicketsRefunded ?? 0,
            TotalRevenueUsd: order.revenueUsd + (order.serviceFeesUsd ?? 0),
          };
          map.set(key, data);
        } else {
          salesData.Purchases += 1;
          salesData.Tickets += order.numTickets;
          salesData.TicketsChargedBack += order.numTicketsChargedBack ?? 0;
          salesData.TicketsRefunded += order.numTicketsRefunded ?? 0;
          salesData.RevenueUsd += order.revenueUsd ?? 0;
          salesData.RevenueChargedBackUsd += order.revenueChargedBackUsd ?? 0;
          salesData.RevenueRefundedUsd += order.revenueRefundedUsd ?? 0;
          salesData.ServiceFeesUsd += order.serviceFeesUsd ?? 0;
          salesData.ServiceFeeRevenueRefundedUsd +=
            order.serviceFeeRevenueRefundedUsd ?? 0;
          salesData.ServiceFeeRevenueChargedBackUsd +=
            order.serviceFeeRevenueChargedBackUsd ?? 0;
          salesData.TotalRevenueUsd +=
            (order.revenueUsd ?? 0) + (order.serviceFeesUsd ?? 0);
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
          RevenueChargedBackUsd: 0,
          RevenueRefundedUsd: 0,
          RevenueUsd: 0,
          ServiceFeeRevenueChargedBackUsd: 0,
          ServiceFeeRevenueRefundedUsd: 0,
          ServiceFeesUsd: 0,
          Tickets: 0,
          TicketsChargedBack: 0,
          TicketsRefunded: 0,
          TotalRevenueUsd: 0,
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
