import { ITicketEventSalesData, ITicketSalesData, Order } from "@/types/event";
import moment from "moment";


export function getPurchaseDataFromOrders(orders: Order[]): ITicketSalesData[] {
    let map = new Map<string, ITicketSalesData>();
    
    orders.forEach((order) => {
        const key = moment(order.purchaseDate).format('YYYY-MM-DD');
        const esd: ITicketEventSalesData = {
            EventId: order.ticketSocketEventId,
            PurchaseDate: `${moment(order.eventDate).format('M/D/YYYY')} - ${order.eventTitle}`,
            Tickets: order.numTickets,
            Revenue: order.revenueUsd
        };

        let salesData = map.get(key);
        if (!salesData) {
            const data: ITicketSalesData = {
                PurchaseDate: moment(key).format('M/D/YYYY'),
                Tickets: order.numTickets,
                Revenue: order.revenueUsd,
                children: [esd]  
            };
            map.set(key, data);
        } else {
            salesData.Tickets += order.numTickets;
            salesData.Revenue += order.revenueUsd;
            if (salesData.children) {
                if (salesData.children.find(x => x.EventId == esd.EventId)) {
                    let eventSalesData = salesData.children.map((item) => {
                        if (item.EventId == esd.EventId) {
                            item.Tickets += order.numTickets;
                            item.Revenue += order.revenueUsd;
                        }
                        return item;
                    });
                    salesData.children = eventSalesData;
                } else {
                    salesData.children.push(esd);
                }
            }            
            map.set(key, salesData);
        }
    });
    

    let ticketSalesData: ITicketSalesData[] = [];
    if (map.size > 0) {
        var keys = Array.from(map.keys()).sort();
        var start = moment(keys[0]);
        var end = moment(keys[keys.length-1]);
        while (start.unix() <= end.unix()) {
            const key = start.format('YYYY-MM-DD');
            let salesData = map.get(key);
            if (!salesData) {
                const data: ITicketSalesData = {
                    PurchaseDate: moment(key).format('MM/DD/YYYY'),
                    Tickets: 0,
                    Revenue: 0,
                    children: []
                };
                ticketSalesData.push(data);
            } else {
                ticketSalesData.push(salesData);
            }
            start = start.add(1, 'days');
        }
    }

    return ticketSalesData;
};